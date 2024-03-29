<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\Exception\ApiException;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class AchievementController extends BaseController {
    const CACHE_OVERVIEW = 'achievements.overview';
    const CACHE_DAILY = 'achievements.daily';
    const CACHE_DAILY_TOMORROW = 'achievements.daily.tomorrow';

    const DAILY_COMPLETIONIST = 1840;

    /** @var \Illuminate\View\View|stdClass $layout */
    protected $layout = 'layout';

    public function details($language, Achievement $achievement) {
        $this->layout->title = $achievement->getName();
        $this->layout->fullWidth = true;
        $this->layout->content = View::make('achievement.details')
            ->with($this->getAchievementData($achievement));

        $this->layout->canonical = $achievement->getUrl();
        $this->layout->metaTitle = $achievement->getName();
        $this->layout->metaImage = $achievement->getIconUrl(64);
        $this->layout->metaDescription = trim(strip_tags($achievement->getData()->requirement . ' ' . $achievement->getData()->description));

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
        return Cache::remember('achievement.data.'.$achievement->id, 10, function() use ($achievement) {
            $achievement->prerequisites->count();
            $achievement->prerequisiteFor->count();

            // access category/group to add them to cache
            if(!is_null($achievement->category)) {
                if(!is_null($achievement->category->group)) {
                    $achievement->category->group->getName();
                } else {
                    $achievement->category->getName();
                }
            }

            $objectives = isset($achievement->getData()->bits)
                ? $achievement->getData()->bits
                : [];


            foreach ($objectives as $index => &$objective) {
                $objective->_index = $index;
            }
            unset($objective);

            $objectives = array_filter($objectives, function ($objective) {
                return isset($objective->type) && ($objective->type !== 'Text' || $objective->text !== '');
            });

            if ($achievement->hasFLag('CategoryDisplay') && !is_null($achievement->category)) {
                /** @var Achievement $categoryAchievement */
                foreach ($achievement->category->achievements as $categoryAchievement) {
                    $isCategoryDisplay = $categoryAchievement->hasFlag('CategoryDisplay');
                    $isHistoric = $categoryAchievement->historic;
                    $isHidden = $categoryAchievement->hasFlag('Hidden');
                    $catRewards = isset($categoryAchievement->getData()->rewards)
                        ? $categoryAchievement->getData()->rewards : [];
                    $isMasteryAchievement = count($catRewards) === 1 && $catRewards[0]->type === 'Mastery' && str_contains($categoryAchievement->getData('en')->requirement, 'Mastery Insight');

                    if (!$isCategoryDisplay && !$isHistoric && !$isHidden && !$isMasteryAchievement) {
                        $objectives[] = (object)[
                            'type' => 'Achievement',
                            'achievement' => $categoryAchievement
                        ];
                    }
                }
            }

            $items = [];
            $skins = [];
            foreach ($objectives as $objective) {
                if ($objective->type === 'Item') {
                    $items[] = $objective->id;
                } elseif ($objective->type === 'Skin') {
                    $skins[] = $objective->id;
                }
            }

            $items = Item::findMany($items)->keyBy('id');
            $skins = Skin::findMany($skins)->keyBy('id');

            foreach ($objectives as $index => &$objective) {
                if ($objective->type === 'Item') {
                    $objective->item = Arr::get($items, $objective->id);
                } elseif ($objective->type === 'Skin') {
                    $objective->skin = Arr::get($skins, $objective->id);
                }
            }
            unset($objective);

            $rewards = isset($achievement->getData()->rewards)
                ? $achievement->getData()->rewards
                : [];


            if ($achievement->achievement_category_id == 97 && Config::get('gw2.daily_event_reward.item')) {
                $rewards[] = (object)[
                    'type' => 'Item',
                    'id' => Config::get('gw2.daily_event_reward.item'),
                    'count' => Config::get('gw2.daily_event_reward.count')
                ];
            }

            return compact('achievement', 'objectives', 'rewards');
        });
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
        $this->layout->content = View::make( 'achievement.overview' )
            ->with(compact('groups', 'daily', 'hidden', 'tomorrow', 'language'));
    }

    /**
     * @param boolean $tomorrow
     * @return mixed
     */
    private function getDailyAchievements($tomorrow) {
        $cacheKey = $tomorrow ? self::CACHE_DAILY_TOMORROW : self::CACHE_DAILY;
        return Cache::remember($cacheKey, $this->getDailyReset($tomorrow), function() use ($tomorrow) {
            $api = new GW2Api();
            $api->schema('2022-03-23T19:00:00.000Z');

            // load daily achievements and daily fractals
            $data = $api->achievements()->categories()->get(97);
            $dataFractals = $api->achievements()->categories()->get(88);

            $dailies = [];
            $ids = [self::DAILY_COMPLETIONIST];

            $key = $tomorrow ? 'tomorrow' : 'achievements';
            

            foreach($data->{$key} as $daily) {
                $dailies[] = $daily;
                $ids[] = $daily->id;
            }

            foreach($dataFractals->{$key} as $daily) {
                $daily->flags = ['fractals'];
                $dailies[] = $daily;
                $ids[] = $daily->id;
            }

            // load achievements
            $achievements = Achievement::with('category')->findMany($ids)->keyBy('id');

            // save achievement objects for all dailies
            foreach($dailies as $daily) {
                $daily->achievement = $achievements->get($daily->id);
                $daily->name = [
                    'de' => ucfirst(preg_replace('/^(Tägliche[rs]? (Abschluss: |PvP-|WvW-)?|Empfohlenes tägliches Fraktal: )/', '', $daily->achievement->getName('de'))),
                    'en' => ucfirst(preg_replace('/^Daily (Recommended Fractal—|PvP |WvW )?/', '', $daily->achievement->getName('en'))),
                    'es' => ucfirst(preg_replace('/((( en)? PvP|( de)? WvW)? del día)/', '', $daily->achievement->getName('es'))),
                    'fr' => $daily->achievement->getName('fr')
                ];
            }

            $dailyCollection = Helper::collect($dailies)
                ->filter(function($daily) { return $daily->achievement != null && isset($daily->flags); })
                ->sort(function($a, $b) {
                    if(isset($a->level) && isset($b->level)) {
                        $max = $a->level[1] - $b->level[1];

                        if($max != 0) {
                            return $max;
                        }

                        $min = $a->level[0] - $b->level[0];
                        if($min != 0) {
                            return $min;
                        }
                    }

                    return Helper::compareByName($a->achievement, $b->achievement);
                })
                ->groupBy(function($daily) { return strtolower($daily->flags[0]); })
                ->toArray();

            return (object) [
                'start' => $this->getDailyReset($tomorrow)->subDay(),
                'reset' => $this->getDailyReset($tomorrow),
                'achievements' => $dailyCollection,
                'reward' => $achievements->get(self::DAILY_COMPLETIONIST)
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
