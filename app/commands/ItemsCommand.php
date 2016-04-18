<?php

use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

class ItemsCommand extends Command {
	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'gw2treasures:items';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Sets aggregated item views of the last 7 days';


	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function fire()
	{
		$views = (new \Illuminate\Support\Collection(DB::table('item_views')
			->select('item_id', DB::raw('COUNT(*) as views'))
			->whereRaw('DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) <= time')
			->groupBy('item_id')
			->get()))->lists('views', 'item_id');

		$count = Item::count();
		$progress = new \Symfony\Component\Console\Helper\ProgressBar($this->getOutput(), $count);
		$progress->setRedrawFrequency(100);
		$progress->start();

		Item::chunk(500, function($items) use ($views, $progress) {
			foreach($items as $item) {
				$item->views = array_key_exists($item->id, $views) ? $views[$item->id] : 0;
				try{
					$item->save();
				} catch(Exception $e) {
					$this->error($item->id);
					throw $e;
				}
				$progress->advance();
			}
		});

		$progress->finish();
		$this->info('');
	}
}
