<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Symfony\Component\Console\Input\InputOption;

class RecipesCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:recipes';
    protected $description = 'Load Recipes from API and store in database';

    public function fire() {
        $api = new GW2Api();

        $updating = $this->option('update');

        if($updating) {
            $this->info('updating existing entries');
        }

        $ids = $api->recipes()->ids();
        $knownIds = DB::table('recipes')->lists('recipe_id');

        $unknownIds = [];
        foreach($ids as $id) {
            if(!in_array($id, $knownIds) || $updating) {
                $unknownIds[] = $id;
            }
        }

        $recipes = $api->recipes()->many($unknownIds);
        $inserts = [];

        foreach($recipes as $recipe) {
            $data = [
                'recipe_id' => $recipe->id,
                'output_id' => $recipe->output_item_id,
                'output_count' => $recipe->output_item_count,
                'disciplines' => $this->disciplinesToBitflags($recipe->disciplines),
                'rating' => $recipe->min_rating,
                'type' => $recipe->type,
                'from_item' => in_array('LearnedFromItem', $recipe->flags),
                'ing_id_1' => isset($recipe->ingredients[0]) ? $recipe->ingredients[0]->item_id : 0,
                'ing_count_1' => isset($recipe->ingredients[0]) ? $recipe->ingredients[0]->count : 0,
                'ing_id_2' => isset($recipe->ingredients[1]) ? $recipe->ingredients[1]->item_id : 0,
                'ing_count_2' => isset($recipe->ingredients[1]) ? $recipe->ingredients[1]->count : 0,
                'ing_id_3' => isset($recipe->ingredients[2]) ? $recipe->ingredients[2]->item_id : 0,
                'ing_count_3' => isset($recipe->ingredients[2]) ? $recipe->ingredients[2]->count : 0,
                'ing_id_4' => isset($recipe->ingredients[3]) ? $recipe->ingredients[3]->item_id : 0,
                'ing_count_4' => isset($recipe->ingredients[3]) ? $recipe->ingredients[3]->count : 0,
                'data' => json_encode($recipe),
                'updated' => true,
                'update_time' => time()
            ];

            if(in_array($recipe->id, $knownIds)) {
                DB::table('recipes')->where('recipe_id', '=', $recipe->id)->update($data);
            } else {
                $inserts[] = $data;
            }

            if(count($inserts) > 250) {
                DB::table('recipes')->insert($inserts);
                $inserts = [];
            }
        };

        if(count($inserts) > 0) {
            DB::table('recipes')->insert($inserts);
            $inserts = [];
        }
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing Recipes']
        ];
    }

    protected function disciplinesToBitflags(array $disciplines) {
        return 0
            | (in_array('Armorsmith', $disciplines) ? 0x1 : 0)
            | (in_array('Artificer', $disciplines) ? 0x2 : 0)
            | (in_array('Chef', $disciplines) ? 0x4 : 0)
            | (in_array('Huntsman', $disciplines) ? 0x8 : 0)
            | (in_array('Jeweler', $disciplines) ? 0x10 : 0)
            | (in_array('Leatherworker', $disciplines) ? 0x20 : 0)
            | (in_array('Tailor', $disciplines) ? 0x40 : 0)
            | (in_array('Weaponsmith', $disciplines) ? 0x80 : 0)
            | (in_array('Scribe', $disciplines) ? 0x100 : 0);
    }
}
