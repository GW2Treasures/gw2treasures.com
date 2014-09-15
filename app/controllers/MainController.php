<?php

class MainController extends BaseController {
	protected $layout = 'layout';

	public function home( $language ) {
		$newItems            = Item::where('updated','=','1')->orderBy('date_added', 'desc')
			->take(30)->remember(10)->get();

		$recentItemViews = DB::table('item_views')
			->select('item_id')
			->orderBy( DB::raw('MAX(item_views.time)'), 'desc' )
			->groupBy( 'item_id' )
			->take(5)->get();
		
		$popularItemViews = DB::table('item_views')
			->select('item_id', DB::raw('COUNT(*) as views'))
			->whereRaw('DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY) <= time')
			->groupBy('item_id')
			->orderBy(DB::raw('COUNT(*)'), 'desc')
			->orderBy( DB::raw('MAX(time)'), 'desc')
			->take(5)->get();

		// get the item_ids we need to load
		$idsToLoad = array();
		foreach( $recentItemViews  as $view ) { $idsToLoad[] = $view->item_id; }
		foreach( $popularItemViews as $view ) { $idsToLoad[] = $view->item_id; }

		if( count( $idsToLoad ) > 0 ) {
			// load the items and convert to dictionary
			$items = Item::whereIn( 'id', $idsToLoad )->get()->getDictionary();

			// assign the items to the views
			foreach( $recentItemViews  as $view ) { $view->item = $items[ $view->item_id ]; }
			foreach( $popularItemViews as $view ) { $view->item = $items[ $view->item_id ]; }
		}

		$this->layout->title = 'Welcome!';
		$this->layout->content = View::make( 'start' )
			->with( 'newItems', $newItems )
			->with( 'recentItemViews', $recentItemViews )
			->with( 'popularItemViews', $popularItemViews );
		$this->layout->fullWidth = true;
	}
}