<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Symfony\Component\Console\Input\InputOption;

class MapsCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:maps';
    protected $description = 'Load Maps from API and store in database';

    public function fire() {
        $api = new GW2Api();

        $updating = $this->option('update');

        if($updating) {
            $this->info('updating existing entries');
        }

        $this->loadEntries('maps', $api->maps(), [
            'region_id', 'continent_id',
            'name_de', 'name_en', 'name_es', 'name_fr',
            'type', 'min_level', 'max_level', 'default_floor',
            'region_name_de', 'region_name_en', 'region_name_es', 'region_name_fr',
            'continent_name_de', 'continent_name_en', 'continent_name_es', 'continent_name_fr',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ], $updating);

        Skill::query()->update(['removed_from_api' => true]);
        Skill::query()->whereIn('id', $api->maps()->ids())->update(['removed_from_api' => false]);
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing Maps']
        ];
    }
}
