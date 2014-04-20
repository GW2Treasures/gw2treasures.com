<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

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

		$skins = json_decode( file_get_contents( 'https://api.guildwars2.com/v1/skins.json' ), true );

		$count = count( $skins['skins'] );
		$this->info( $count . ' skins loaded' );
		$this->info( 'loading skin_details.json' );

		$data = array();

		foreach( $skins['skins'] as $i => $id ) {
			$de = json_decode( file_get_contents( 'https://api.guildwars2.com/v1/skin_details.json?lang=de&skin_id=' . $id ), true );
			$en = json_decode( file_get_contents( 'https://api.guildwars2.com/v1/skin_details.json?lang=en&skin_id=' . $id ), true );
			$es = json_decode( file_get_contents( 'https://api.guildwars2.com/v1/skin_details.json?lang=es&skin_id=' . $id ), true );
			$fr = json_decode( file_get_contents( 'https://api.guildwars2.com/v1/skin_details.json?lang=fr&skin_id=' . $id ), true );

			$data[] = array(
				'id' => $id,

				'name_de' => $de['name'],
				'name_en' => $en['name'],
				'name_es' => $es['name'],
				'name_fr' => $fr['name'],

				'type' => $en['type'],

				'signature' => $en['icon_file_signature'],
				'file_id'   => $en['icon_file_id'],

				'data_de' => json_encode( $de ),
				'data_en' => json_encode( $en ),
				'data_es' => json_encode( $es ),
				'data_fr' => json_encode( $fr )
			);

			$this->info( '(' . ($i + 1) . '/' . $count . ') Loaded [' . $id . '] ' . $en['name'] );

			if( count( $data ) == 250 ) {
				$data = $this->insertIntoDB( $data );
			}
		}
		$this->insertIntoDB( $data );
		$this->info( 'Done.' );
	}
}
