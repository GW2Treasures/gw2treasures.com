<?php

class ItemController extends BaseController {

	public function showDetails( $language, Item $item )
	{
		return View::make( 'item.details', array( 'lang' => $language, 'item' => $item ));
	}
}