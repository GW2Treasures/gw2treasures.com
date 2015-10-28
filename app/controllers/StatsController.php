<?php

class StatsController extends BaseController {
	protected $layout = 'layout';

	public function itemsNew( $language ) {
		if( Cache::has( 'stats.items.new:' . $language ) && !isset( $_GET['nocache'] )) {
			$this->layout->content = Cache::get( 'stats.items.new:' . $language );
			$this->layout->cached = true;
		} else {
			// SELECT WEEK(`date_added`), DAYOFWEEK(`date_added`), DATE(`date_added`), COUNT(*) FROM items WHERE `date_added` <> '0000-00-00 00:00:00' GROUP BY DATE(`date_added`) LIMIT 365

			// UPDATE `gw2treasures`.`items` as t LEFT JOIN `konrad_gw2wBot`.`items` as b ON b.id = t.id SET t.`date_added` = b.added WHERE t.date_added > b.added AND b.added <> '0000-00-00 00:00:00'

			/** TIMELINE **/
			$newestDay = head( DB::select('SELECT DATE(`date_added`) as "date" FROM `items` WHERE `date_added` <> "0000-00-00 00:00:00" GROUP BY DATE(`date_added`) ORDER BY `date_added` DESC LIMIT 49,1' ))->date;

			$items = Item::whereRaw('DATE(`date_added`) >= "'. $newestDay .'"')->orderBy('date_added', 'desc')->select('id', 'signature', 'file_id', 'date_added')->remember(60)->get();

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


			/** TIMETABLE **/
			$data = DB::select('SELECT 
			                        ( YEAR(date_added) - YEAR(NOW()) + 1 ) * 52
			                        + WEEK(date_added) - WEEK(NOW()) as x,
			                        DAYOFWEEK(date_added) - 1 as y,
			                        DATE(date_added) as date,
			                        COUNT(*) as count
			                    FROM items 
			                    WHERE 
			                        date_added > (now() - interval 1 year) 
			                    GROUP BY DATE(date_added)
			                    ORDER BY date_added DESC
			                    LIMIT 365');

			$dataTable = array();
			foreach( $data as $record ) {
				if( !isset( $dataTable[ $record->y ] )) {
					$dataTable[ $record->y ] = array();
				}
				$dataTable[ $record->y ][ $record->x ] = $record;
			}

			$content = View::make( 'stats.items.new' )
				->with( 'items', $itemsGroupedByDate )
				->with( 'table', $dataTable )
				->render();
			Cache::put( 'stats.items.new:' . $language, $content, 30 );
			$this->layout->content = $content;
		}
			
		$this->layout->title = trans( 'stats.newItems' );
	}
}
