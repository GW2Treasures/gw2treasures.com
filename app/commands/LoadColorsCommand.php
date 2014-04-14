<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class LoadColorsCommand extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'gw2treasures:loadcolors';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Loads colors from the official API and stores them in the database';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function fire()
	{
		$this->info('Loading colors.json...');

		$json = array(
			'de' => json_decode( file_get_contents( 'https://api.guildwars2.com/v1/colors.json?lang=de' ), true),
			'en' => json_decode( file_get_contents( 'https://api.guildwars2.com/v1/colors.json?lang=en' ), true),
			'es' => json_decode( file_get_contents( 'https://api.guildwars2.com/v1/colors.json?lang=es' ), true),
			'fr' => json_decode( file_get_contents( 'https://api.guildwars2.com/v1/colors.json?lang=fr' ), true)
		);

		$this->info('Parsing colors.json...');

		$data = array();

		foreach( $json['en']['colors'] as $id => $color ) {
			$data[] = array(
				'id' => $id,
				'name_de' => $json['de']['colors'][$id]['name'],
				'name_en' => $json['en']['colors'][$id]['name'],
				'name_es' => $json['es']['colors'][$id]['name'],
				'name_fr' => $json['fr']['colors'][$id]['name'],
				'base_rgb'    => $this->rgb( $color['base_rgb'][0],       $color['base_rgb'][1],       $color['base_rgb'][2]       ),
				'cloth_rgb'   => $this->rgb( $color['cloth']['rgb'][0],   $color['cloth']['rgb'][1],   $color['cloth']['rgb'][2]   ),
				'leather_rgb' => $this->rgb( $color['leather']['rgb'][0], $color['leather']['rgb'][1], $color['leather']['rgb'][2] ),
				'metal_rgb'   => $this->rgb( $color['metal']['rgb'][0],   $color['metal']['rgb'][1],   $color['metal']['rgb'][2]   ),
				'data_de' => json_encode( $json['de']['colors'][$id] ),
				'data_en' => json_encode( $json['en']['colors'][$id] ),
				'data_es' => json_encode( $json['es']['colors'][$id] ),
				'data_fr' => json_encode( $json['fr']['colors'][$id] )
			);
		}

		$this->info('Inserting into database...');

		DB::table('colors')->insert( $data );

		$this->info('Done.');
	}

	private function rgb( $r, $g, $b ) {
		return ($r << 16) | ($g << 8) | $b;
	}
}
