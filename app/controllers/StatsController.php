<?php

class StatsController extends BaseController {
	protected $layout = 'layout';

	public function itemsNew( $language ) {
		if( Cache::has( 'stats.items.new' ) && !isset( $_GET['nocache'] )) {
			$this->layout->content = Cache::get( 'stats.items.new' );
			$this->layout->cached = true;
		} else {
			$newestDay = head( DB::select('SELECT DATE(`date_added`) as "date" FROM `items` WHERE `date_added` <> "0000-00-00 00:00:00" GROUP BY DATE(`date_added`) ORDER BY `date_added` DESC LIMIT 49,1' ))->date;

			$items = Item::whereRaw('DATE(`date_added`) >= "'. $newestDay .'"')->orderBy('date_added', 'desc')->get();

			$itemsGroupedByDate = array();
			$lastDate = null;

			foreach( $items as $item ) {
				$date = new \Carbon\Carbon( $item->date_added );
				if( $lastDate == null || $date->diff( $lastDate )->days > 0 ) {
					$lastDate = $date;
					$itemsGroupedByDate[] = array(
						'items' => array(),
						'date' => $date
					);
				}

				$itemsGroupedByDate[ count( $itemsGroupedByDate ) - 1 ]['items'][] = $item;
			}

			$content = View::make( 'stats.items.new' )
				->with( 'items', $itemsGroupedByDate )
				->render();
			Cache::put( 'stats.items.new', $content, 30 );
			$this->layout->content = $content;
		}
			
		$this->layout->title = trans( 'stats.newItems' );
	}
}