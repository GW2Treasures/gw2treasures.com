<?php

class ItemController extends BaseController {

	protected $layout = 'layout';

	public function showDetails( $language, Item $item )
	{
		$key = 'itemdetails-' . $language . '-' . $item->id;

		if( Cache::has( $key ) ) {
			$this->layout->content = Cache::get( $key );
			$this->layout->title = $item->getName( );
			$this->layout->cached = true;

		} else {
			$content = View::make( 'item.details', array( 'item' => $item ))->render();

			$this->layout->content = $content;
			$this->layout->title = $item->getName( );

			Cache::put( $key, $content, 30 );
		}
	}

	public function search( $language ) {
		$searchTerm = trim( Input::get('q') );
		
		// item id
		if( preg_match('/^[0-9]+$/', $searchTerm ) ) {
			$item = Item::find( intval( $searchTerm ) );
			if( !is_null( $item ) ) {
				return Redirect::route( 'itemdetails', array( $language, $searchTerm ));
			}
		}

		// chatlink
		if( preg_match( '/\\[&([A-Za-z0-9+]+=*)\\]/', $searchTerm, $matches )) {
			$id = Item::decodeChatlink( $matches[1] );
			if( $id ) {
				return Redirect::route( 'itemdetails', array( $language, $id ));
			}
		}

		$items = Item::search( $searchTerm )->take( 100 )->get();

		$this->layout->content = View::make( 'item.searchresults', array( 
			'items' => $items, 'searchterm' => $searchTerm ));
		$this->layout->title = 'searchresults';
	}

	public function searchAutocomplete( $language ) {
		$searchTerm = trim( Input::get('q') );

		//$items = Item::search( $searchTerm )->take( 10 )->get();
		$items = Item::searchQuery( DB::table( 'items' ), $searchTerm )
			->select( 'id', 'name_' . $language . ' as name', 'file_id', 'signature' )
			->take( 10 )
			->get();
		
		foreach ($items as $item) {
			$item->icon = Helper::cdn( 'icons/' . $item->signature . '/' . $item->file_id . '-32px.png', $item->file_id );
			unset( $item->file_id );
			unset( $item->signature );
		}

		$response = new stdClass();
		$response->items = $items;

		return Response::json( $response );
	}
}