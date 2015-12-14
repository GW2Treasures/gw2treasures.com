<?php

use Illuminate\Support\Arr;

class AchievementController extends BaseController {
	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details( $language, Achievement $achievement ) {
		$this->layout->title = $achievement->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make( 'achievement.details' )
			->with($this->getAchievementData($achievement));
	}

	private function getAchievementData(Achievement $achievement) {
		$objectives = isset($achievement->getData()->bits)
			? $achievement->getData()->bits
			: [];

		$items = [];
		$skins = [];
		foreach($objectives as $objective) {
			if($objective->type === 'Item') {
				$items[] = $objective->id;
			} elseif($objective->type === 'Skin') {
				$skins[] = $objective->id;
			}
		}

		$items = Item::findMany($items)->keyBy('id');
		$skins = Item::findMany($skins)->keyBy('id');

		foreach($objectives as &$objective) {
			if($objective->type === 'Item') {
				$objective->item = Arr::get($items, $objective->id);
			} elseif($objective->type === 'Skin') {
				$objective->skin = Arr::get($skins, $objective->id);
			}
		}

		$rewards = isset($achievement->getData()->rewards)
			? isset($achievement->getData()->rewards)
			: [];

		return compact('achievement', 'objectives', 'rewards');
	}

	public function json( $language, Achievement $achievement ) {
		return Response::json( $achievement->getData() );
	}

	public function overview( $language ) {
		$categories = Cache::remember('achievement.categories', 60 * 24, function() {
			return AchievementCategory::where('id', '!=', 97)
				->with('achievements')->with('achievements.category')
				->get();
		});
		$this->layout->title = trans( 'achievement.overview' );
		$this->layout->content = View::make( 'achievement.overview' )->with(compact('categories'));
	}
}
