<?php

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
        $popularItemViews = DB::table('item_views')
            ->select('item_id', DB::raw('COUNT(*) as views'))
            ->whereRaw('DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY) <= time')
            ->groupBy('item_id')
            ->orderBy(DB::raw('COUNT(*)'), 'desc')
            ->orderBy(DB::raw('MAX(time)'), 'desc')
            ->take(10)->get();

        if(count($popularItemViews) === 10 && $popularItemViews[5]->views > 100) {
            $recentItemViews = [];
        } else {
            $recentItemViews = DB::select(
                'SELECT view.item_id
                 FROM (SELECT item_id, time FROM item_views ORDER BY item_views.time DESC LIMIT 30) view
                 GROUP BY view.item_id
                 ORDER BY view.time DESC
                 LIMIT 5' );
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
        $newAchievements = Achievement::orderBy('created_at', 'desc')->take(5)->get();

        $popularAchievementViews = DB::table('achievement_views')
            ->select('achievement_id', DB::raw('COUNT(*) as views'))
            ->whereRaw('DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY) <= time')
            ->groupBy('achievement_id')
            ->orderBy(DB::raw('COUNT(*)'), 'desc')
            ->orderBy(DB::raw('MAX(time)'), 'desc')
            ->take(10)->get();

        $popularAchievementViews = new \Illuminate\Support\Collection($popularAchievementViews);

        $achievements = Achievement::whereIn('id', $popularAchievementViews->lists('achievement_id'))->get()->getDictionary();

        $popularAchievementViews->each(function($a) use ($achievements) {
            $a->achievement = $achievements[$a->achievement_id];
        })->toArray();

        return compact('newAchievements', 'popularAchievementViews');
    }

    public function about( $language ) {
        $this->layout->title = 'About';
        $this->layout->content = View::make( 'about' );
        $this->layout->fullWidth = true;
    }
}
