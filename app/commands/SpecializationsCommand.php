<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Symfony\Component\Console\Input\InputOption;

class SpecializationsCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:specializations';
    protected $description = 'Load Specializations from API and store in database';

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

        $this->loadEntries('specializations', $api->specializations(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'profession_id' => 'profession', 'signature', 'file_id',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ], $updating);

        Specialization::query()->update(['removed_from_api' => true]);
        Specialization::query()->whereIn('id', $api->specializations()->ids())->update(['removed_from_api' => false]);
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing specializations']
        ];
    }
}
