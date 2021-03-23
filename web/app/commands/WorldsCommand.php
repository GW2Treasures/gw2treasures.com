<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Symfony\Component\Console\Input\InputOption;

class WorldsCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:worlds';
    protected $description = 'Load worlds from API and store in database';

    public function fire() {
        $api = new GW2Api();

        $updating = $this->option('update');

        if($updating) {
            $this->info('updating existing entries');
        }

        $this->loadEntries('worlds', $api->worlds(), [
            'id',
            'name_de', 'name_en', 'name_es', 'name_fr',
        ], $updating);
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing worlds']
        ];
    }
}
