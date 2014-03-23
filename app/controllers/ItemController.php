<?php

class ItemController extends BaseController {

	protected $layout = 'layout';

	public function showDetails( $language, Item $item ) {
		$key = 'itemdetails-' . $language . '-' . $item->id . ( isset( $_GET['showSimilar'] ) ? '-showSimilar' : '' );

		if( Cache::has( $key ) && !isset( $_GET['nocache'] )) {
			$this->layout->content = Cache::get( $key );
			$this->layout->title = $item->getName( );
			$this->layout->cached = true;
		} else {
			$content = View::make( 'item.details', array( 'item' => $item ))->render();

			$this->layout->content = $content;
			$this->layout->title = $item->getName( );

			Cache::forever( $key, $content );
		}
	}

	public function json( $language, Item $item ) {
		return Response::json( $item->getData() );
	}

	public function random( $language ) {
		$id = Item::random()->first()->id;
		return Redirect::route( 'itemdetails', array( $language, $id ));
	}

	public function tooltip( $language, Item $item ) {
		return $item->getTooltip( $language );
	}

	public function search( $language ) {
		$searchTerm = trim( Input::get('q') );
		$items = array();

		if( strlen( $searchTerm ) > 0 ) {
			// item id
			if( preg_match('/^[0-9]+$/', $searchTerm ) ) {
				$item = Item::find( intval( $searchTerm ) );
				if( !is_null( $item ) ) {
					return Redirect::route( 'itemdetails', array( $language, $searchTerm ));
				}
			}

			// chatlink
			if(( $chatlink = Chatlink::TryDecode( $searchTerm )) !== false ) {
				switch( $chatlink->type ) {
					case Chatlink::TYPE_ITEM:
						return Redirect::route( 'itemdetails', array( $language, $chatlink->id ));
					case Chatlink::TYPE_RECIPE:
						$recipe = Recipe::find( $chatlink->id );
						return Redirect::route( 'itemdetails', array( $language, $recipe->output_id ));
				}
			}

			$items = Item::search( $searchTerm )->take( 1000 )->get();
			if( $items->count() == 0 ) {
				$items = Item::search( $searchTerm, true )->take( 1000 )->get();
			}
			$items = Item::sortSearchResult( $items , $searchTerm );
		}

		$this->layout->content = View::make( 'item.searchresults', array( 
			'items' => $items, 'searchterm' => $searchTerm ));
		$this->layout->title = 'searchresults';
	}

	public function searchAutocomplete( $language ) {
		$searchTerm = trim( Input::get('q') );

		if(( $chatlink = Chatlink::TryDecode( $searchTerm )) !== false ) {
			switch( $chatlink->type ) {
				case Chatlink::TYPE_ITEM:
					$items = array( DB::table( 'items' )->select( 'id', 'name_' . $language . ' as name', 'file_id', 'signature' )->find( $chatlink->id ));
					break;
				case Chatlink::TYPE_RECIPE:
					$recipe = Recipe::find( $chatlink->id );
					$items = array( DB::table( 'items' )->select( 'id', 'name_' . $language . ' as name', 'file_id', 'signature' )->find( $recipe->output_id ));
					break;
			}
		} else {
			$items = Item::searchQuery( DB::table( 'items' ), $searchTerm )
				->select( 'id', 'name_' . $language . ' as name', 'file_id', 'signature' )
				->take( 10 )
				->get();
		}
		
		//dd( $items );

		foreach ($items as $item) {
			$item->icon16 = Helper::cdn( 'icons/' . $item->signature . '/' . $item->file_id . '-16px.png', $item->file_id );
			$item->icon32 = Helper::cdn( 'icons/' . $item->signature . '/' . $item->file_id . '-32px.png', $item->file_id );
			$item->icon64 = Helper::cdn( 'icons/' . $item->signature . '/' . $item->file_id . '-64px.png', $item->file_id );
			unset( $item->file_id );
			unset( $item->signature );
		}

		$response = new stdClass();
		$response->items = $items;

		return Response::json( $response );
	}
}