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

		$items = Item::search( $searchTerm )->get();

		$this->layout->content = View::make( 'item.searchresults', array( 
			'items' => $items, 'searchterm' => $searchTerm ));
		$this->layout->title = 'searchresults';
	}
}