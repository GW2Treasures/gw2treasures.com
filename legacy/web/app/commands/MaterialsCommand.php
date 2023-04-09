<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Symfony\Component\Console\Input\InputOption;

class MaterialsCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:materials';
    protected $description = 'Load Materials from API and store in database';

    public function fire() {
        $api = new GW2Api();

        $updating = $this->option('update');

        if($updating) {
            $this->info('updating existing entries');
        }

        $this->loadEntries('materials', $api->materials(), [
            'name_de', 'name_en', 'name_es', 'name_fr',
            'order',
            'data_de', 'data_en', 'data_es', 'data_fr',
            'created_at', 'updated_at',
        ], $updating);

        Item::query()->update(['material_id' => 0]);
        Material::all()->each(function(Material $material) {
            Item::whereIn('id', $material->getData()->items)->update(['material_id' => $material->id]);
        });
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing Materials']
        ];
    }
}
