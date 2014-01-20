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
			$content = View::make( 'item.details', array( 'lang' => $language, 'item' => $item ))->render();

			$this->layout->content = $content;
			$this->layout->title = $item->getName( );

			Cache::put( $key, $content, 30 );
		}
	}
}