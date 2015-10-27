<?php

	class Recipe extends BaseModel {
		protected $primaryKey = 'recipe_id';

		protected $appends = array( 
			'totalIngredients'
		); 


		public function getTotalIngredientsAttribute() {
			$ingredients = 0;
			foreach( $this->getIngredientCounts() as $count ) {
				$ingredients += $count > 0 ? 1 : 0;
			}
			return $ingredients;
		}

		private $d = null;
		public function getData( ) {
			if( is_null( $this->d ) ) {
				$this->d = json_decode( $this->data );
			}
			return $this->d;
		}

		//---- relations

		public function output() { return $this->belongsTo('Item', 'output_id'); }

		public function unlockedBy() { return $this->hasOne('Item', 'unlock_id', 'recipe_id'); } 

		public function ingredient1() { return $this->belongsTo('Item', 'ing_id_1'); }
		public function ingredient2() { return $this->belongsTo('Item', 'ing_id_2'); }
		public function ingredient3() { return $this->belongsTo('Item', 'ing_id_3'); }
		public function ingredient4() { return $this->belongsTo('Item', 'ing_id_4'); }

		public function scopeHasIngredient( $query, Item $ingredient ) {
			return $query->  where( 'ing_id_1', '=', $ingredient->id )
			             ->orWhere( 'ing_id_2', '=', $ingredient->id )
			             ->orWhere( 'ing_id_3', '=', $ingredient->id )
			             ->orWhere( 'ing_id_4', '=', $ingredient->id );
		}

		public function scopeWithIngredient( $query ) {
			return $query->with('ingredient1', 'ingredient2', 'ingredient3', 'ingredient4');
		}

		public function scopeWithAll( $query ) {
			return $this->scopeWithIngredient( $query )->with('unlockedBy', 'output');
		}

		public function getIngredients() { 
			return array( $this->ingredient1, $this->ingredient2, $this->ingredient3, $this->ingredient4 );
		}
		public function getIngredientIDs() {
			return array( $this->ing_id_1, $this->ing_id_2, $this->ing_id_3, $this->ing_id_4 );
		}
		public function getIngredientCounts() {
			return array( $this->ing_count_1, $this->ing_count_2, $this->ing_count_3, $this->ing_count_4 );
		}

		//---- stuff

		public function hasFlag( $flag ) {
			return in_array( $flag, $this->getData( )->flags );
		}

		//---- disciplines

		const DISCIPLINE_ARMORSMITH = 0x1;
		const DISCIPLINE_ARTIFICER = 0x2;
		const DISCIPLINE_CHEF = 0x4;
		const DISCIPLINE_HUNTSMAN = 0x8;
		const DISCIPLINE_JEWELER = 0x10;
		const DISCIPLINE_LEATHERWORKER = 0x20;
		const DISCIPLINE_TAILOR = 0x40;
		const DISCIPLINE_WEAPONSMITH = 0x80;

		public static $DISCIPLINES = array(
			self::DISCIPLINE_ARMORSMITH    => 'armorsmith',
			self::DISCIPLINE_ARTIFICER     => 'artificer',
			self::DISCIPLINE_CHEF          => 'chef',
			self::DISCIPLINE_HUNTSMAN      => 'huntsman',
			self::DISCIPLINE_JEWELER       => 'jeweler',
			self::DISCIPLINE_LEATHERWORKER => 'leatherworker',
			self::DISCIPLINE_TAILOR        => 'tailor',
			self::DISCIPLINE_WEAPONSMITH   => 'weaponsmith',
		);

		public function hasDiscipline( $discipline ) {
			return ($this->disciplines & $discipline) == $discipline;
		}
	}
