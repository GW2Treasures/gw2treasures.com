<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Symfony\Component\Console\Input\InputOption;

class MountsCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:mounts';
    protected $description = 'Load Mounts and their skins from API and store in database';

    public function fire() {
        $api = new GW2Api();

        $updating = $this->option('update');

        if($updating) {
            $this->info('updating existing entries');
        }

        $this->loadEntries('mount_types', $api->mounts()->types(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'default_skin',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ], $updating);

        $this->loadEntries('mount_skins', $api->mounts()->skins(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'mount', 'signature', 'file_id',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ], $updating);
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing Materials']
        ];
    }
}
