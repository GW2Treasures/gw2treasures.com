<?php

use Carbon\Carbon;

class Match extends BaseModel {
	const REGION_US = 'us';
	const REGION_EU = 'eu';
	const WORLD_RED   = 'Red';
	const WORLD_BLUE  = 'Blue';
	const WORLD_GREEN = 'Green';
	const NEUTRAL = 'Neutral';

	private $_d;
	private $_objectives;
	private $_oc;
	private $_income;

	protected $appends = array( 
		'region', 
		'objectives',
		'objectiveCounts',
		'income',
		'scores',
		'worlds'
	);

	public function red_world()   { return $this->belongsTo('World', 'red_world_id'); }
	public function blue_world()  { return $this->belongsTo('World', 'blue_world_id'); }
	public function green_world() { return $this->belongsTo('World', 'green_world_id'); }

	public function scopeWithWorlds( $query ) { 
		return $query->with('red_world', 'blue_world', 'green_world');
	}

	public function scopeHasWorld( $query, World $world ) {
		return $query->where( function( $q ) use ( $world ) {
			return $q->  where(   'red_world_id', '=', $world->id )
			         ->orWhere(  'blue_world_id', '=', $world->id )
			         ->orWhere( 'green_world_id', '=', $world->id );
		});
	}

	public function scopeCurrent( $query ) {
		return $query->where('end_time', '>', Carbon::now());
	}

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

	public function getObjectiveCountsAttribute() {
		if( !isset( $this->_oc )) {
			$this->_oc = array(
				self::WORLD_RED => array(
					Objective::TYPE_CASTLE => 0,
					Objective::TYPE_KEEP   => 0,
					Objective::TYPE_TOWER  => 0,
					Objective::TYPE_CAMP   => 0,
					Objective::TYPE_RUIN   => 0
				),
				self::WORLD_BLUE => array(
					Objective::TYPE_CASTLE => 0,
					Objective::TYPE_KEEP   => 0,
					Objective::TYPE_TOWER  => 0,
					Objective::TYPE_CAMP   => 0,
					Objective::TYPE_RUIN   => 0
				),
				self::WORLD_GREEN => array(
					Objective::TYPE_CASTLE => 0,
					Objective::TYPE_KEEP   => 0,
					Objective::TYPE_TOWER  => 0,
					Objective::TYPE_CAMP   => 0,
					Objective::TYPE_RUIN   => 0
				),
				self::NEUTRAL => array(
					Objective::TYPE_CASTLE => 0,
					Objective::TYPE_KEEP   => 0,
					Objective::TYPE_TOWER  => 0,
					Objective::TYPE_CAMP   => 0,
					Objective::TYPE_RUIN   => 0
				),
			);

			foreach ($this->objectives as $objective) {
				$this->_oc[ $objective->owner ][ $objective->type ]++;
			}
		}

		return $this->_oc;
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

	public function getScoreAttribute() {
		return array( 
			self::WORLD_RED   => $this->red_score,
			self::WORLD_BLUE  => $this->blue_score,
			self::WORLD_GREEN => $this->green_score
		);
	}

	public function getWorldsAttribute() {
		return array(
			self::WORLD_RED   => $this->red_world,
			self::WORLD_BLUE  => $this->blue_world,
			self::WORLD_GREEN => $this->green_world
		);
	}
}