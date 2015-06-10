<?php

use Illuminate\Console\Command;
use GW2Treasures\GW2Api\GW2Api;

class LoadSkinsCommand extends Command {
    protected $name = 'gw2treasures:loadskins';
    protected $description = 'Load Skins from API and store in database';

    public function __construct()
    {
        parent::__construct();
    }

    private function insertIntoDB( $data ) {
        if( count( $data ) == 0 ) {
            return array();
        }
        $this->info('Inserting ' . count( $data ) . ' entries into database...');
        DB::table('skins')->insert( $data );
        return array();
    }

    public function fire()
    {
        $this->info( 'loading skins.json' );
        $api = (new GW2Api())->skins();

        $skins = $api->ids();

        $count = count( $skins );
        $this->info( $count . ' skins loaded' );


        $this->info( 'loading known skins from database' );
        $knownSkins = DB::table('skins')->lists( 'id' );
        $this->info( count( $knownSkins ) . ' already known' );

        $this->info( 'loading skin_details.json' );

        $unknownSkins = [];
        foreach( $skins as $id ) {
            if( !in_array( $id, $knownSkins )) {
                $unknownSkins[] = $id;
            }
        }

        $skins_de = $api->lang('de')->many($unknownSkins);
        $skins_en = $api->lang('en')->many($unknownSkins);
        $skins_es = $api->lang('es')->many($unknownSkins);
        $skins_fr = $api->lang('fr')->many($unknownSkins);

        $data = array();

        foreach( $unknownSkins as $i => $id ) {
            preg_match('/\/(?<signature>[^\/]*)\/(?<file_id>[^\/]*)\.png$/', $skins_en[$i]->icon, $icon);
            $signature = $icon['signature'];
            $file_id = $icon['file_id'];

            $data[] = array(
                'id' => $id,

                'name_de' => $skins_de[$i]->name,
                'name_en' => $skins_en[$i]->name,
                'name_es' => $skins_es[$i]->name,
                'name_fr' => $skins_fr[$i]->name,

                'type' => $skins_en[$i]->type,

                'signature' => $signature,
                'file_id'   => $file_id,

                'data_de' => json_encode( $skins_de[$i] ),
                'data_en' => json_encode( $skins_en[$i] ),
                'data_es' => json_encode( $skins_es[$i] ),
                'data_fr' => json_encode( $skins_fr[$i] )
            );

            $this->info( '(' . ($i + 1) . '/' . $count . ') Loaded [' . $id . '] ' . $skins_en[$i]->name );

            if( count( $data ) == 250 ) {
                $data = $this->insertIntoDB( $data );
            }
        }
        $this->insertIntoDB( $data );
        $this->info( 'Done.' );
    }
}
