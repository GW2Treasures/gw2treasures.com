<?php

class MainController extends BaseController {
	protected $layout = 'layout';

	public function home( $language ) {
		$newItems            = Item::where('updated','=','1')->orderBy('date_added', 'desc')
			->take(30)->remember(10)->get();
		
		$recentlyViewedItems = Item::join('item_views', 'item_views.item_id', '=', 'items.id' )
			->select('items.*')
			->orderBy( DB::raw('MAX(item_views.time)'), 'desc' )
			->groupBy( 'items.id' )
			->take(5)->remember(1)->get();
		
		$popularItems = Item::join('item_views', 'item_views.item_id', '=', 'items.id' )
			->select('items.*', DB::raw('COUNT(*) as views') )
			->whereRaw('DATE_SUB(CURRENT_DATE(), INTERVAL 24 HOUR) <= item_views.time')
			->groupBy('items.id')
			->orderBy(DB::raw('COUNT(*)'), 'desc')
			->orderBy( DB::raw('MAX(item_views.time)'), 'desc')
			->take(5)->remember(5)->get();

		$this->layout->title = 'Welcome!';
		$this->layout->content = View::make( 'start' )
			->with( 'newItems', $newItems )
			->with( 'recentlyViewedItems', $recentlyViewedItems )
			->with( 'popularItems', $popularItems );
		$this->layout->fullWidth = true;
	}
}