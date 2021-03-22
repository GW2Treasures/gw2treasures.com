<?php

use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

class ItemsCommand extends Command {
    use LoadsEntries;

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
		$api = new GW2Api();

        $updating = $this->option('update');

        if($updating) {
            $this->info('updating existing entries');
        }

        $this->loadEntries('items', $api->items(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'signature', 'file_id',
			'type', 'rarity', 'level', 'value' => 'vendor_value',
			'pvp' => function($item) { return $item->game_types === ['Pvp', 'PvpLobby']; },
			'subtype' => function($item) { return $item->details->type ?? ''; },
			'weight' => function($item) { return $item->details->weight_class ?? 'None'; },
			'suffix_item_id' => function($item) { return $item->details->suffix_item_id ?? 0; },
			'secondary_suffix_item_id' => function($item) { return $item->details->secondary_suffix_item_id ?? 0; },
			'unlock_type' => function($item) { return $item->details->unlock_type ?? ''; },
			'unlock_id' => function($item) { return $item->details->color_id ?? ($item->details->recipe_id ?? 0); },
            'desc_de', 'desc_en', 'desc_es', 'desc_fr',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'update_time' => function() { return time(); },
			'updated' => function() { return true; },
        ], false);

		$this->info('aggregating item views');

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
			    /** @var Item $item */
                $details = $item->getTypeData();

				$oldViews = $item->views;

			    // set item views
				$item->views = array_key_exists($item->id, $views) ? $views[$item->id] : 0;


                // set item for unlocked recipes
                if($item->type == 'Consumable' && $item->subtype == 'Unlock' && $details->unlock_type == 'CraftingRecipe') {
                    $unlockedRecipes = [];

                    $unlockedRecipes[] = $details->recipe_id;
                    if(isset($details->extra_recipe_ids)) {
                        $unlockedRecipes = array_merge($unlockedRecipes, $details->extra_recipe_ids);
                    }

                    Recipe::whereIn('recipe_id', $unlockedRecipes)->update(['unlock_item_id' => $item->id]);
                }


                // save
				try {
					if($item->views !== $oldViews) {
						$item->save();
					}
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

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing items']
        ];
    }
}
