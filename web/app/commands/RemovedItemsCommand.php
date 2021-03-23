<?php

use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Console\Command;

class RemovedItemsCommand extends Command {
	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'gw2treasures:removed-items';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Marks items as removed from API';


	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function fire()
	{
        $api = new GW2Api();

        $ids = $api->items()->ids();

        Item::query()->whereNotIn('id', $ids)->update(['removed_from_api' => true]);
	}
}
