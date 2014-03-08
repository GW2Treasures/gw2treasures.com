<?php

class Objective {
	const TYPE_CASTLE = 'castle';
	const TYPE_KEEP   = 'keep';
	const TYPE_TOWER  = 'tower';
	const TYPE_CAMP   = 'camp';
	const TYPE_RUIN   = 'ruin';
	//===
	private static $objectiveJSON;
	private static $scores = array(
		self::TYPE_CASTLE => 35,
		self::TYPE_KEEP   => 25,
		self::TYPE_TOWER  => 10,
		self::TYPE_CAMP   =>  5,
		self::TYPE_RUIN   =>  0
	);
	//===
	public $id;
	public $owner;
	public $owner_guild;
	public $type;
	public $score;
	public $coords;
	private $names;

	function __construct( $id, $owner, $owner_guild = null ) {
		$this->id          = $id;
		$this->owner       = $owner;
		$this->owner_guild = $owner_guild;

		if( !isset( self::$objectiveJSON )) {
			self::$objectiveJSON = json_decode( file_get_contents( app_path() . '/library/objectives.json' ));
		}

		$this->type   = self::$objectiveJSON->{$this->id}->type;
		$this->score  = self::$scores[ $this->type ];
		$this->coords = self::$objectiveJSON->{$this->id}->coords;
		$this->names  = array(
			'de' => self::$objectiveJSON->{$this->id}->name->de,
			'en' => self::$objectiveJSON->{$this->id}->name->en,
			'es' => self::$objectiveJSON->{$this->id}->name->es,
			'fr' => self::$objectiveJSON->{$this->id}->name->fr
		);
	}

	public function getName( $lang = null ) {
		if( is_null( $lang )) {
			$lang = App::getLocale();
		}
		return $this->names[ $lang ];
	}
}