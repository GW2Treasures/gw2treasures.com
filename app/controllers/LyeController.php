<?php

use Carbon\Carbon;

class LyeController extends BaseController {
    /** @var \Illuminate\View\View|stdClass $layout  */
    protected $layout = 'layout';

    public function overview() {
        $this->layout->content = View::make('lye.overview')->with([
            'missing_recipes' => $this->missingRecipes(),
            'missing_items_objectives' => $this->missingItemsObjectives(),
            'missing_items_rewards' => $this->missingItemsRewards(),
            'missing_skins' => $this->missingSkins()
        ]);
        $this->layout->title = 'API whitelist issues';
    }

    private function missingRecipes() {
        return Cache::remember('lye.missingRecipes', 10, function() {
            return (object)[
                'time' => Carbon::now(),
                'data' => Item::leftJoin('recipes', 'unlock_id', '=', 'recipe_id')
                    ->select('items.*')
                    ->whereNull('recipe_id')
                    ->where('unlock_type', '=', 'CraftingRecipe')
                    ->get()
            ];
        });
    }

    private function missingItemsObjectives() {
        return Cache::remember('lye.missingItemsObjectives', 10, function() {
            return (object)[
                'time' => Carbon::now(),
                'data' => $this->joinAchievements(DB::table('achievement_objectives')
                    ->leftJoin('items', 'entity_id', '=', 'items.id')
                    ->select('achievement_objectives.*')
                    ->whereNull('items.id')
                    ->where('achievement_objectives.type', '=', 'item')
                    ->get())
            ];
        });
    }

    private function missingItemsRewards() {
        return Cache::remember('lye.missingItemsRewards', 10, function() {
            return (object)[
                'time' => Carbon::now(),
                'data' => $this->joinAchievements(DB::table('achievement_rewards')
                    ->leftJoin('items', 'entity_id', '=', 'items.id')
                    ->select('achievement_rewards.*')
                    ->whereNull('items.id')
                    ->where('achievement_rewards.type', '=', 'item')
                    ->get())
            ];
        });
    }

    private function missingSkins() {
        return Cache::remember('lye.missingSkins', 10, function() {
            return (object)[
                'time' => Carbon::now(),
                'data' => Item::leftJoin('skins', 'skins.id', '=', 'skin_id')
                    ->select('items.*')
                    ->whereNull('skins.id')
                    ->where('skin_id', '!=', '0')
                    ->get()
            ];
        });
    }

    private function joinAchievements($data) {
        $achievements = [];

        foreach($data as $d) {
            $achievements[] = $d->achievement_id;
        }

        $achievements = Achievement::with('category')->findMany($achievements)->getDictionary();

        foreach($data as $d) {
            $d->achievement = $achievements[$d->achievement_id];
        }

        return $data;
    }
}
