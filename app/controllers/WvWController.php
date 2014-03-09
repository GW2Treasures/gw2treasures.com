<?php

class WvWController extends BaseController {
	protected $layout = 'layout';

	public function overview( $language ) {
		$matches = Match::current()->withWorlds()->get();

		$this->layout->title = trans( 'wvw.overview' );
		$this->layout->content = View::make( 'wvw.overview' )
			->with( 'matches', $matches );
	}

	public function world( $language, World $world ) {
		$this->layout->title = $world->getName();
		$this->layout->content = View::make( 'wvw.world' )
			->with( 'world', $world );
	}

	public function worldEmbedded( $language, World $world ) {
		return View::make( 'wvw.worldEmbedded' )
			->with( 'world', $world );
	}
}