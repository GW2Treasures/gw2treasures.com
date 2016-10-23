<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class AchievementController extends BaseController {
	const CACHE_OVERVIEW = 'achievements.overview';
	const CACHE_DAILY = 'achievements.daily';

	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details($language, Achievement $achievement) {
		$this->layout->title = $achievement->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make('achievement.details')
			->with($this->getAchievementData($achievement));

		DB::table('achievement_views')->insert([
			'achievement_id' => $achievement->id,
			'language' => $language,
		]);
	}

	public function category( $language, AchievementCategory $achievement_category ) {
		$this->layout->title = $achievement_category->getName();
		$this->layout->content = View::make('achievement.category')->with('category', $achievement_category);
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
		$skins = Skin::findMany($skins)->keyBy('id');

		foreach($objectives as &$objective) {
			if($objective->type === 'Item') {
				$objective->item = Arr::get($items, $objective->id);
			} elseif($objective->type === 'Skin') {
				$objective->skin = Arr::get($skins, $objective->id);
			}
		}

		$rewards = isset($achievement->getData()->rewards)
			? $achievement->getData()->rewards
			: [];


		if($achievement->achievement_category_id == 97) {
//			$rewards[] = (object)['type' => 'Item', 'id' => 39752, 'count' => 8];
			$rewards[] = (object)['type' => 'Item', 'id' => 36038, 'count' => 1];
		}

		return compact('achievement', 'objectives', 'rewards');
	}

	public function json( $language, Achievement $achievement ) {
		return Response::json( $achievement->getData() );
	}

	public function tooltip($language, Achievement $achievement) {
		return View::make('achievement.tooltip')->with($this->getAchievementData($achievement));
	}

	public function random($language) {
		$id = Achievement::random()->first()->id;
		return Redirect::route('achievement.details', [$language, $id]);
	}

	public function overview($language) {
		$groups = Cache::remember(self::CACHE_OVERVIEW, 60 * 24, function() {
			return AchievementGroup::orderBy('order')
				->with(['categories' => function($query) {
					return $query->orderBy('order');
				}])
				->get();
		});

		$daily = $this->getDailyAchievements();

		$hidden = [
			'groups' => [],
			'categories' => []
		];

		$this->layout->title = trans( 'achievement.overview' );
		$this->layout->fullWidth = true;
		$this->layout->content = View::make( 'achievement.overview' )->with(compact('groups', 'daily', 'hidden'));
	}

	private function getDailyAchievements() {
		return Cache::remember(self::CACHE_DAILY, $this->getDailyReset(), function() {
			$api = new GW2Api();

			// load daily achievements and daily fractals
			$data = $api->achievements()->daily()->get();
			$fractals = $api->achievements()->categories()->get(88);

			// add daily fractals
			$data->fractals = [];
			foreach($fractals->achievements as $fractalAchievement) {
				$data->fractals[] = (object)[
					'id' => $fractalAchievement,
					'level' => null
				];
			}

			// get all achievement ids
			$ids = [];
			foreach(['pve', 'pvp', 'wvw', 'fractals', 'special'] as $type) {
				foreach($data->{$type} as $achievement) {
					$ids[] = $achievement->id;
				}
			}

			// load achievements
			$achievements = Achievement::with('category')->findMany($ids)->keyBy('id');

			// save achievement objects for all dailies
			foreach(['pve', 'pvp', 'wvw', 'fractals', 'special'] as $type) {
				foreach($data->{$type} as $achievement) {
					$achievement->achievement = $achievements->get($achievement->id);
				}
			}

			return (object)[
				'reset' => $this->getDailyReset(),
				'achievements' => $data
			];
		});
    }

	/**
	 * @return Carbon
	 */
	private function getDailyReset() {
		return Carbon::tomorrow('UTC');
	}
}
