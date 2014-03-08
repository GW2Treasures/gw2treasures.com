<?php

class WVWController extends BaseController {
	protected $layout = 'layout';

	public function overview( $language ) {
		$matches = Match::all();

		$this->layout->title = trans( 'wvw.overview' );
		$this->layout->content = View::make( 'wvw.overview' )
			->with( 'matches', $matches );
	}

}