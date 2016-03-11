<?php

use Carbon\Carbon;

class StatsController extends BaseController {
	protected $layout = 'layout';

	public function itemsNew( $language ) {
		$today = Carbon::today();

		// TODO: make sure date is valid
		if(Request::has('date')) {
			$date = Carbon::createFromFormat('Y-m-d', Request::get('date'));
		} else {
			$date = $today;
		}

		// get dates

		$start = $date->copy()->startOfWeek();
		$end = $date->copy()->endOfWeek();

		$startPrev = $start->copy()->subWeek();
		$endPrev = $end->copy()->subWeek();

		$startNext = $start->copy()->addWeek();
		$endNext = $end->copy()->addWeek();

		$canShowNextWeek = $today->gte($startNext);


		// get items

		$days = $this->getItems($start, $end);


		// get dropdown
		$dropdown = $this->getDropdownValues();

		$this->layout->content = View::make('stats.items.new')
			->with(compact('today', 'start', 'end', 'startPrev', 'endPrev', 'startNext', 'endNext', 'canShowNextWeek', 'days'))
			->with($dropdown);
			
		$this->layout->title = trans( 'stats.newItems' );
		$this->layout->canonical = route('stats.items.new', [App::getLocale(), 'date' => $start->format('Y-m-d')]);
		$this->layout->fullWidth = true;
	}

	/**
	 * @param Carbon $start
	 * @param Carbon $end
	 * @return $this|\Illuminate\Support\Collection
	 */
	private function getItems($start, $end)
	{
		$today = Carbon::today();
		$isCurrentWeek = $end->gte($today) && $start->lte($today);

		return Cache::remember('stats.items.new.items.'.$start->format('Y-m-d'), $isCurrentWeek ? 30 : 60 * 24 * 7, function() use($start, $end) {
			$days = new \Illuminate\Support\Collection();

			$items = Item::where('date_added', '>', $start)->where('date_added', '<', $end)
				->with('unlocksSkin')->orderBy('date_added', 'DESC')->get();

			$items->each(function ($item) use ($days) {
				$date = Carbon::parse($item->date_added)->startOfDay();
				$key = $date->format('Y-m-d');

				if (!$days->offsetExists($key)) {
					$days[$key] = (object)[
						'date' => $date,
						'items' => []
					];
				}

				$days[$key]->items[] = $item;
			});

			$days = $days->sortByDesc('date');

			return $days;
		});
	}

	/**
	 * @return array
	 */
	private function getDropdownValues()
	{
		return Cache::remember('stats.items.dropdown', 60 * 24, function() {
			$today = Carbon::today();

			$stats = DB::table('items')
				->where('date_added', '!=', '0000-00-00 00:00:00')
				->groupBy(DB::raw('DATE(`date_added`)'))
				->select(['date_added', DB::raw('COUNT(*) as count')])->get();
			$stats = new \Illuminate\Support\Collection($stats);

			$dropDown = new \Illuminate\Support\Collection();

			$oldest = $today;
			$maxPerDay = 0;

			$stats->each(function ($stats) use ($dropDown, &$oldest, &$maxPerDay) {
				$date = Carbon::parse($stats->date_added)->startOfDay();
				$week = $date->copy()->startOfWeek();
				$key = $week->format('Y-m-d');

				if ($week < $oldest) {
					$oldest = $week->copy();
				}
				if ($stats->count > $maxPerDay) {
					$maxPerDay = $stats->count;
				}

				if (!$dropDown->has($key)) {
					$dropDown[$key] = (object)[
						'start' => $week,
						'end' => $week->copy()->endOfWeek(),
						'days' => []
					];
				}

				$dropDown[$key]->days[$date->format('Y-m-d')] = $stats->count;
			});

			// fill in blanks
			for ($i = $oldest->copy(); $i <= $today;) {
				$key = $i->format('Y-m-d');

				if (!$dropDown->has($key)) {
					$dropDown[$key] = (object)[
						'start' => $i->copy(),
						'end' => $i->copy()->endOfWeek(),
						'days' => []
					];
				}

				for ($j = 0; $j < 7; $j++, $i->addDay()) {
					$dayKey = $i->format('Y-m-d');
					if (!array_key_exists($dayKey, $dropDown[$key]->days)) {
						$dropDown[$key]->days[$dayKey] = 0;
					}
				}

				ksort($dropDown[$key]->days);
			}

			$dropDown = $dropDown->sortByDesc('start');

			return compact('dropDown', 'maxPerDay');
		});
	}
}
