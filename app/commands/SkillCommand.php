<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Symfony\Component\Console\Input\InputOption;

class SkillCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:skills';
    protected $description = 'Load Skills from API and store in database';

    public function fire() {
        $api = new GW2Api();

        $updating = $this->option('update');

        if($updating) {
            $this->info('updating existing entries');
        }

        $this->loadEntries('skills', $api->skills(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'description_de', 'description_en', 'description_es', 'description_fr',
            'type', 'weapon_type', 'slot', 'signature', 'file_id',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ], $updating);

        Skill::chunk(250, function($skills) {
            /** @var Skill $skill */
            foreach($skills as $skill) {
                $facts = $skill->getTraitedFacts();

                /** @var \Illuminate\Support\Collection $requiredKnown */
                $requiredKnown = $skill->requiresTraits()->get()->keyBy('id');

                $facts = new \Illuminate\Support\Collection($skill->getTraitedFacts());
                $facts = $facts->filter(function($fact) {
                    return isset($fact->requires_trait);
                })->lists('requires_trait');

                $facts = array_unique($facts);

                foreach($facts as $required) {
                    if(!$requiredKnown->has($required)) {
                        $skill->requiresTraits()->attach($required);
                        $this->info('attached '.$required.' to '.$skill->id);
                    }
                }

                foreach($requiredKnown as $knownRequiredTrait) {
                    if(!in_array($knownRequiredTrait->id, $facts)) {
                        $skill->requiresTraits()->detach($knownRequiredTrait->id);
                    }
                }
            }
        });
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing Skills']
        ];
    }


}
