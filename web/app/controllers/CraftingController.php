<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class CraftingController extends BaseController {
    /** @var \Illuminate\View\View|stdClass $layout */
    protected $layout = 'layout';

    public function details($language, $discipline) {
        $disciplineId = array_search($discipline, Recipe::$DISCIPLINES);

        $recipes = Recipe::whereHasDiscipline($disciplineId)->withAll()->orderBy('rating')->remember(60)->get();

        $this->layout->title = trans('recipe.discipline'.$discipline);
        $this->layout->content = View::make('crafting.details')
            ->with(compact('discipline', 'recipes'));
    }

    public function discoverable($language, $discipline) {
        $recipes = Cache::remember("crafting.$discipline.discoverable", 60, function() use($discipline) {
            $disciplineId = array_search($discipline, Recipe::$DISCIPLINES);

            return Recipe::whereHasDiscipline($disciplineId)
                ->whereFromItem(0)
                ->withAll()
                ->orderBy('rating')
                ->remember(60)
                ->get()
                ->filter(function(Recipe $recipe) {
                    return !$recipe->hasFlag('AutoLearned');
                });
        });

        $this->layout->title = trans('recipe.discipline'.$discipline);
        $this->layout->content = View::make('crafting.details')
            ->with(compact('discipline', 'recipes'))
            ->with('discoverable', true);
    }

    public function overview($language) {
        $disciplines = Recipe::$DISCIPLINES;

        $this->layout->title = trans('crafting.breadcrumb');
        $this->layout->content = View::make('crafting.overview')
            ->with(compact('disciplines'));
    }
}
