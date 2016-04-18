<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;
use Symfony\Component\Console\Input\InputOption;

class SkinsCommand extends Command {
    use LoadsEntries;

    protected $name = 'gw2treasures:skins';
    protected $description = 'Load Skins from API and store in database';

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

        $this->info('updating subtype...');

        Skin::chunk(500, function($skins) {
            /** @var Skin $skin */
            foreach($skins as $skin) {
                $skin->subtype = isset($skin->getTypeData()->type)
                    ? $skin->getTypeData()->type
                    : '';

                if( $skin->isDirty() ) {
                    $skin->save();
                    $this->info('Updated subtype of '.$skin->id);
                }
            }
        });

        $this->info('setting item skins...');

        Item::where('skin_id','=','0')->chunk( 500, function( $items ) {
            /** @var Item[] $items */
            foreach( $items as $item ) {
                if( isset( $item->getData( 'en' )->default_skin ) && $item->getData( 'en' )->default_skin != $item->skin_id ) {
                    $item->skin_id = $item->getData( 'en' )->default_skin;
                } elseif( isset( $item->getTypeData('en')->skins ) && count( $item->getTypeData()->skins ) > 0 ) {
                    $item->skin_id = $item->getTypeData()->skins[0];
                }

                if( $item->getOriginal('skin_id') !== $item->skin_id ) {
                    CacheHelper::ClearItemDetails( $item );
                    CacheHelper::ClearItemTooltip( $item );
                    $item->save();
                }
            }
        });
    }

    protected function getOptions() {
        return [
            ['update', 'u', InputOption::VALUE_NONE, 'Update existing achievements']
        ];
    }
}
