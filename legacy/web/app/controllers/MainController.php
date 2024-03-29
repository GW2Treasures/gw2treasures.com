<?php

use Carbon\Carbon;

class MainController extends BaseController {
    /** @var Illuminate\View\View|stdClass $layout */
    protected $layout = 'layout';

    public function home( $language ) {
        $this->layout->title = 'Welcome!';
        $this->layout->content = View::make('start')
            ->with($this->getItemsForMainpage())
            ->with($this->getAchievementsForMainpage());
        $this->layout->fullWidth = true;
    }

    private function getItemsForMainpage() {
        // get new items
        $newItems = Item::where('updated', '=', '1')->orderBy('date_added', 'desc')->take(30)->remember(10)->get();

        // get popular items
        try {
            $popularItemViews = DB::table('item_views')
                ->select('item_id', DB::raw('COUNT(*) as views'))
                ->whereRaw('DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY) <= time')
                ->groupBy('item_id')
                ->orderBy(DB::raw('COUNT(*)'), 'desc')
                ->orderBy(DB::raw('MAX(time)'), 'desc')
                ->take(10)->get();
        } catch(\Illuminate\Database\QueryException $ex) {
            $popularItemViews = [];
        }

        if(count($popularItemViews) === 10 && $popularItemViews[5]->views > 100) {
            $recentItemViews = [];
        } else {
            try {
                $recentItemViews = DB::select(
                    'SELECT view.item_id
                     FROM (SELECT item_id, time FROM item_views ORDER BY item_views.time DESC LIMIT 30) view
                     GROUP BY view.item_id
                     ORDER BY view.time DESC
                     LIMIT 5'
                );
            } catch(\Illuminate\Database\QueryException $ex) {
                $recentItemViews = [];
            }
        }

        // get the item_ids we need to load
        $idsToLoad = [];
        foreach( $recentItemViews  as $view ) { $idsToLoad[] = $view->item_id; }
        foreach( $popularItemViews as $view ) { $idsToLoad[] = $view->item_id; }

        // load models
        if(!empty($idsToLoad)) {
            // load the items and convert to dictionary
            $items = Item::whereIn( 'id', $idsToLoad )->get()->getDictionary();

            // assign the items to the views
            foreach( $recentItemViews  as $view ) { $view->item = $items[ $view->item_id ]; }
            foreach( $popularItemViews as $view ) { $view->item = $items[ $view->item_id ]; }
        }

        return compact('newItems', 'recentItemViews', 'popularItemViews');
    }

    private function getAchievementsForMainpage() {
        try {
            $popularAchievementViews = DB::table('achievement_views')
                ->select('achievement_id', DB::raw('COUNT(*) as views'))
                ->whereRaw('DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY) <= time')
                ->groupBy('achievement_id')
                ->orderBy(DB::raw('COUNT(*)'), 'desc')
                ->orderBy(DB::raw('MAX(time)'), 'desc')
                ->take(10)->get();
        } catch(\Illuminate\Database\QueryException $ex) {
            $popularAchievementViews = [];
        }

        $popularAchievementViews = new \Illuminate\Support\Collection($popularAchievementViews);

        $newAchievements = Achievement::orderBy('created_at', 'desc')->take(max(5, $popularAchievementViews->count()))
            ->remember(10)->select('id')->get();

        $ids = array_merge($popularAchievementViews->lists('achievement_id'), $newAchievements->lists('id'));

        $achievements = Achievement::whereIn('id', $ids)->with('category')->remember(10)->get()->getDictionary();

        $popularAchievementViews->each(function($a) use ($achievements) {
            $a->achievement = $achievements[$a->achievement_id];
        })->toArray();

        $newAchievements = $newAchievements->map(function($a) use ($achievements) {
            return $achievements[$a->id];
        });

        return compact('newAchievements', 'popularAchievementViews');
    }

    public function about( $language ) {
        $this->layout->title = 'About';
        $this->layout->content = View::make( 'about' );
        $this->layout->fullWidth = true;
    }

    public function summer2021( $language ) {
        Notification::Remove( 'summer2021' );

        $events = [[
            'date' => Carbon::createMidnightDate(2021, 5, 11),
            'type' => 'eod',
            'key' => '2021-5-11-skills-balance',
        ], [
            'date' => Carbon::createMidnightDate(2021, 5, 14),
            'type' => 'bonus-event',
            'key' => '2021-5-14-wvw'
        ],
        [
            'date' => Carbon::createMidnightDate(2021, 5, 25),
            'type' => 'bonus-event',
            'key' => '2021-5-25-pvp'
        ], [
            'date' => Carbon::createMidnightDate(2021, 5, 25),
            'type' => 'eod',
            'key' => '2021-5-25-living-world'
        ], [
            'date' => Carbon::createMidnightDate(2021, 6, 1),
            'type' => 'bonus-event',
            'key' => '2021-6-1-fractals'
        ],
        [
            'date' => Carbon::createMidnightDate(2021, 6, 18),
            'type' => 'bonus-event',
            'key' => '2021-6-18-wvw'
        ],
        [
            'date' => Carbon::createMidnightDate(2021, 6, 22),
            'type' => 'bonus-event',
            'key' => '2021-6-22-dragon-bash'
        ],
        [
            'date' => Carbon::createMidnightDate(2021, 7, 5),
            'type' => 'bonus-event',
            'key' => '2021-7-5-pvp-tournament'
        ],
        [
            'date' => Carbon::createMidnightDate(2021, 7, 13),
            'type' => 'eod',
            'key' => '2021-7-13-twisted-marionette'
        ],
        [
            'date' => Carbon::createMidnightDate(2021, 7, 23),
            'type' => 'bonus-event',
            'key' => '2021-7-23-wvw'
        ], [
            'date' => Carbon::createMidnightDate(2021, 7, 27),
            'type' => 'eod',
            'key' => '2021-7-27-eod'
        ]];

        $this->layout->title = 'Summer 2021';
        $this->layout->content = View::make( 'special/summer2021' )
            ->with(compact('events'));
        $this->layout->fullWidth = true;
    }
}
