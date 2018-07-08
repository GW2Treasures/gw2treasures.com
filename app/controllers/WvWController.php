<?php

class WvWController extends BaseController {
	protected $layout = 'layout';

	public function overview( $language ) {
		$matches = Match::current()->with('worlds')->orderBy('match_id')->get();

		$this->layout->title = trans( 'wvw.overview' );
		$this->layout->content = View::make( 'wvw.overview' )
			->with('matches', $matches)
            ->with('columns', self::getColumns());
	}

	public function world( $language, World $world ) {
		$this->layout->title = $world->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make( 'wvw.world' )
			->with('world', $world)
            ->with('columns', self::getColumns());
	}

	public function worldEmbedded( $language, World $world ) {
		return View::make( 'wvw.worldEmbedded' )
			->with('world', $world)
            ->with('columns', self::getColumns());
	}

	public static function getColumns() {
	    $columns = explode(',', Request::query('columns', ''));

	    $columns = array_filter($columns, function($column) {
	        return View::exists('wvw.matchBox.'.$column);
        });

	    return empty($columns)
            ? ['victory', 'skirmish']
            : $columns;
    }
}
