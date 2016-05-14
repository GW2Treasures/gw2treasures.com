<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Symfony\Component\Console\Input\InputOption;

class ProfessionCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:professions';
    protected $description = 'Load Professions from API and store in database';

    public function fire() {
        $api = new GW2Api();

        $updating = $this->option('update');

        if($updating) {
            $this->info('updating existing entries');
        }

        $this->loadEntries('professions', $api->professions(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'signature', 'file_id',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ], $updating);
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing professions']
        ];
    }


}
