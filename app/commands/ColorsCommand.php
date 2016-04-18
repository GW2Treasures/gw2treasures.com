<?php

use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

class ColorsCommand extends Command {
	use LoadsEntries;

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'gw2treasures:colors';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Loads colors from the official API and stores them in the database';


	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function fire()
	{
		$api = new GW2Api();

		$updating = $this->option('update');

		$this->loadEntries('colors', $api->colors(), [
			'name_de', 'name_en', 'name_es', 'name_fr',
			'base_rgb' => function($data) { return $this->rgb($data->base_rgb); },
			'cloth_rgb' => function($data) { return $this->rgb($data->cloth->rgb); },
			'leather_rgb' => function($data) { return $this->rgb($data->leather->rgb); },
			'metal_rgb' => function($data) { return $this->rgb($data->metal->rgb); },
			'data_de', 'data_en', 'data_es', 'data_fr'
		], $updating);
	}

	protected function getOptions() {
		return [
			['update', 'u', InputOption::VALUE_NONE, 'Update existing achievements']
		];
	}

	private function rgb( $a ) {
		return ($a[0] << 16) | ($a[1] << 8) | $a[2];
	}
}
