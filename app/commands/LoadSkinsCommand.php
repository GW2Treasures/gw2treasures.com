<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Symfony\Component\Console\Input\InputOption;

class LoadSkinsCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:loadskins';
    protected $description = 'Load Skins from API and store in database';

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

        $this->loadEntries('skins', $api->skins(), ['id',
            'name_de', 'name_en', 'name_es', 'name_fr',
            'type', 'signature', 'file_id',
            'data_de', 'data_en', 'data_es', 'data_fr'], $updating);
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing achievements']
        ];
    }
}
