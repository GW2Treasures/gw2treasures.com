<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\Exception\ApiException;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class AchievementController extends BaseController {
	const CACHE_OVERVIEW = 'achievements.overview';
	const CACHE_DAILY = 'achievements.daily';
	const CACHE_DAILY_TOMORROW = 'achievements.daily.tomorrow';

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
		$this->layout->fullWidth = true;
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


		if($achievement->achievement_category_id == 97 && Config::get('gw2.daily_event_reward.item')) {
            $rewards[] = (object)[
                'type' => 'Item',
                'id' => Config::get('gw2.daily_event_reward.item'),
                'count' => Config::get('gw2.daily_event_reward.count')
            ];
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

		$tomorrow = Request::query('dailies') === 'tomorrow';

		try {
            $daily = $this->getDailyAchievements($tomorrow);
        } catch (ApiException $x) {
		    $daily = false;
        }

		$hidden = [
			'groups' => [],
			'categories' => []
		];

		$this->layout->title = trans( 'achievement.overview' );
		$this->layout->fullWidth = true;
		$this->layout->content = View::make( 'achievement.overview' )->with(compact('groups', 'daily', 'hidden', 'tomorrow'));
	}

    /**
     * @param boolean $tomorrow
     * @return mixed
     */
	private function getDailyAchievements($tomorrow) {
	    $cacheKey = $tomorrow ? self::CACHE_DAILY_TOMORROW : self::CACHE_DAILY;
		return Cache::remember($cacheKey, $this->getDailyReset($tomorrow), function() use ($tomorrow) {
			$api = new GW2Api();

			// load daily achievements and daily fractals
			$data = $tomorrow
                ? $api->achievements()->daily()->tomorrow()->get()
                : $api->achievements()->daily()->get();

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

            foreach(['pve', 'pvp', 'wvw', 'fractals', 'special'] as $type) {
			    $data->{$type} = Helper::collect($data->{$type})->sort(function($a, $b) {
			        if($a->level != null && $b->level != null) {
			            $max = $a->level->max - $b->level->max;

                        if($max != 0) {
                            return $max;
                        }

                        $min = $a->level->min - $b->level->min;
                        if($min != 0) {
                            return $min;
                        }
                    }

                    return Helper::compareByName($a->achievement, $b->achievement);
                });
            }

            return (object) [
                'start' => $this->getDailyReset($tomorrow)->subDay(),
				'reset' => $this->getDailyReset($tomorrow),
				'achievements' => $data
			];
		});
    }

    /**
     * @param boolean $tomorrow
     * @return Carbon
     */
	private function getDailyReset($tomorrow) {
		return Carbon::tomorrow('UTC')->addDays($tomorrow ? 1 : 0);
	}
}
