<?php

class SkinController extends BaseController {
	protected $layout = 'layout';

	public function details( $language, Skin $skin ) {
		$this->layout->title = $skin->getName();
		$this->layout->content = View::make( 'skin.details' )
			->with( 'skin', $skin );
	}

	public function overview( $language ) {
		$this->layout->title = trans( 'skin.overview' );
		$this->layout->content = View::make( 'skin.overview' );
	}

	public function armor( $language ) {
		$skins = Skin::where( 'type','=','armor' )->orWhere( 'type','=','back' )->get();

		$this->layout->title = trans( 'skin.armor' );
		$this->layout->content = View::make( 'skin.listByType' )
			->with( 'skins', $skins );
	}

	public function weapon( $language ) {
		$skins = Skin::where( 'type','=','weapon' )->get();

		$this->layout->title = trans( 'skin.weapons' );
		$this->layout->content = View::make( 'skin.listByType' )
			->with( 'skins', $skins );
	}
}