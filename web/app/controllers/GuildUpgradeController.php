<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class GuildUpgradeController extends BaseController {
	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details($language, GuildUpgrade $upgrade) {
		$itemIds = Helper::collect($upgrade->getData()->costs)
			->filter(function($cost) { return isset($cost->item_id); })
			->lists('item_id');

		$items = Item::whereIn('id', $itemIds)->remember(60)->get()->getDictionary();

		$this->layout->title = $upgrade->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make('guild.upgrade.details')
			->with(compact('upgrade', 'items'));
	}
	
	public function json($language, GuildUpgrade $upgrade) {
		return Response::json($upgrade->getData());
	}

	public function random($language) {
		$id = GuildUpgrade::random()->first()->id;

		return Redirect::route('guild.upgrade.details', [$language, $id]);
	}


	public function overview($language) {
        $data = Cache::remember('guild.upgrade.overview', 60, function() {
            return [
                'upgrades' => GuildUpgrade::get()->groupBy('type')
            ];
        });

		$this->layout->title = trans('guild.upgrade.breadcrumb');
		$this->layout->content = View::make('guild.upgrade.overview')
			->with($data);
	}
}
