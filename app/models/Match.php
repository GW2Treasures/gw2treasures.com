<?php

class Match extends BaseModel {
	const REGION_US = 'us';
	const REGION_EU = 'eu';
	const WORLD_RED   = 'Red';
	const WORLD_BLUE  = 'Blue';
	const WORLD_GREEN = 'Green';
	const NEUTRAL = 'Neutral';

	private $_d;
	private $_objectives;
	private $_income;

	protected $appends = array( 
		'region', 
		'objectives',
		'income'
	);

	public function getRegionAttribute() {
		return $this->match_id[0] == '1' ? self::REGION_US : self::REGION_EU;
	}

	public function getDataAttribute( $value ) {
		if( !isset( $this->_d )) {
			$this->_d = json_decode( $value );
		}
		return $this->_d;
	}

	public function getObjectivesAttribute() {
		if( !isset( $this->_objectives )) {
			$this->_objectives = array();

			foreach ($this->data->maps as $map) {
				foreach ($map->objectives as $objective) {
					$this->_objectives[$objective->id ] = new Objective( $objective->id, $objective->owner, isset( $objective->owner_guild ) ? $objective->owner_guild : null );
				}
			}
		} 
		return $this->_objectives;
	}

	public function getIncomeAttribute() {
		if( !isset( $this->_income )) {
			$this->_income = array( 
				self::WORLD_RED   => 0,
				self::WORLD_BLUE  => 0,
				self::WORLD_GREEN => 0
			);

			foreach ($this->objectives as $objective) {
				if( $objective->owner != self::NEUTRAL ) {
					$this->_income[ $objective->owner ] += $objective->score;
				}
			}
		}
		return $this->_income;
	}

	public static function getWorldName( $world_id, $lang = null ) {
		if( is_null( $lang )) {
			$lang = App::getLocale();
		}

		$json = Cache::rememberForever( 'world_names.json?lang=' . $lang, function() use ( $lang ) {
			return file_get_contents( 'https://api.guildwars2.com/v1/world_names.json?lang=' . $lang );
		});
		$worlds = json_decode( $json );
		foreach( $worlds as $world ) {
			if( $world->id == $world_id ) {
				return $world->name;
			}
		}

		return 'UNKNOWN';
	}
}