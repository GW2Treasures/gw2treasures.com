<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Symfony\Component\Console\Input\InputOption;

class TraitsCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:traits';
    protected $description = 'Load Traits from API and store in database';

    public function __construct()
    {
        parent::__construct();
    }
    
    public function fire() {
        $api = new GW2Api();

        $updating = $this->option('update');

        if($updating) {
            $this->info('updating existing entries');
        }

        $this->loadEntries('traits', $api->traits(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'description_de', 'description_en', 'description_es', 'description_fr',
            'tier', 'order', 'slot', 'specialization_id' => 'specialization', 'signature', 'file_id',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ], $updating);
        
        Traits::chunk(250, function($traits) {
            foreach($traits as $trait) {
                /** @var Traits $trait */

                /** @var \Illuminate\Support\Collection $requiredKnown */
                $requiredKnown = $trait->requiresTraits()->get()->keyBy('id');

                $facts = new \Illuminate\Support\Collection($trait->getTraitedFacts());
                $facts = $facts->filter(function($fact) {
                    return isset($fact->requires_trait);
                })->lists('requires_trait');

                $facts = array_unique($facts);

                foreach($facts as $required) {
                    if(!$requiredKnown->has($required)) {
                        $trait->requiresTraits()->attach($required);
                        $this->info('attached '.$required.' to '.$trait->id);
                    }
                }

                foreach($requiredKnown as $knownRequiredTrait) {
                    if(!in_array($knownRequiredTrait->id, $facts)) {
                        $trait->requiresTraits()->detach($knownRequiredTrait->id);
                    }
                }
            }
        });

        Traits::query()->update(['removed_from_api' => true]);
        Traits::query()->whereIn('id', $api->traits()->ids())->update(['removed_from_api' => false]);
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing traits']
        ];
    }
}
