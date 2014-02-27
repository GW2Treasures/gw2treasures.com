<?php

class Item extends BaseModel {
	private $d = array();

	public function getName( $lang = null ) { return $this->localized( 'name', $lang ); }

	public function getDescription( $lang = null ) {
		$description = $this->getData( $lang )->description;
		$description = preg_replace( '/<c=@([^>]+)>(.*)/s', '<span class="color-$1">$2</span>', $description );
		$description = preg_replace( '/<c=#([^>]+)>(.*)/s', '<span class="color-colored" style="color:#$1">$2</span>', $description );
		$description = preg_replace( '/\n/', '<br />', $description );
		return $description;
	}

	public function getData( $lang = null ) { 
		if ( !array_key_exists( $lang, $this->d ) ) {
			$this->d[ $lang ] = json_decode( 
				str_replace( array( '<br>' ),
				             array( '\n'   ),
				             $this->localized( 'data', $lang )));
		}
		return $this->d[ $lang ];
	}
	public function getTypeData( $lang = null) {
		switch( $this->type ) {
			case 'CraftingMaterial' : $t = 'crafting_material'; break;
			case 'MiniPet'          : $t = 'mini_pet'; break;
			case 'UpgradeComponent' : $t = 'upgrade_component'; break;
			default                 : $t = strtolower( $this->type ); break;
		}
		if ( isset( $this->getData( $lang )->{$t} ) )
			return $this->getData( $lang )->{$t};

		return new stdClass();
	}
	public function getFlags( ) { return $this->getData()->flags; }
	public function hasFlag( $flag ) { return in_array( $flag, $this->getFlags() ); }

	private $si;
	public function getSuffixItem( ) {
		return isset($si) ? $si : ($si = Item::find( $this->getTypeData()->suffix_item_id ) ); 
	}

	public function getUrl( $lang = null ) {
		if( is_null( $lang ) ) $lang = App::getLocale();
		return URL::route( 'itemdetails', array('language' => $lang, 'item' => $this->id ));
	}
	public function getIconUrl( $size = 64 ) {
		$size = intval( $size );
		if( !in_array( $size, array( 16, 32, 64) )) {
			if( $size <= 16 ) { 
				$size = 16;
			} elseif ( $size <= 32 ) {
				$size = 32;
			} else {
				$size = 64;
			}
		}

		return Helper::cdn( 'icons/' . $this->signature . '/' . $this->file_id . '-' . $size . 'px.png', $this->file_id );
	}
	public function getChatLink( ) {
		return Chatlink::Encode( Chatlink::TYPE_ITEM, $this->id )->chatlink;
	}

	//---- Relations

	public function recipes() {
		return $this->hasMany('Recipe', 'output_id');
	}

	public function unlocks() {
		return $this->belongsTo('Recipe', 'unlock_id', 'recipe_id');
	}

	public function ingredientForRecipes() {
		return Recipe::hasIngredient( $this )->withAll();
	}

	public function scopeHasUpgrade( $query, Item $item ) {
		return $query->where( 'suffix_item_id', '=', $item->id );
	}

	public static function searchQuery( $query, $term, $or = false ) {
		$term =  mb_strtoupper( trim( $term ));
		
		preg_match_all( '/\S+/', $term, $matches, PREG_SET_ORDER );
		
		$query->where( function( $query ) use ( $matches, $or ) { 
			foreach ( $matches as $match ) {
				$match = $match[0];

				if( $or ) {
					$query->orWhereRaw( 'UPPER(name_de) LIKE ?', array('%'.$match.'%'))
					      ->orWhereRaw( 'UPPER(name_en) LIKE ?', array('%'.$match.'%'))
					      ->orWhereRaw( 'UPPER(name_es) LIKE ?', array('%'.$match.'%'))
					      ->orWhereRaw( 'UPPER(name_fr) LIKE ?', array('%'.$match.'%'));
				} else {
					$query->where(function( $query ) use ( $match ) {
						$query->  whereRaw( 'UPPER(name_de) LIKE ?', array('%'.$match.'%'))
						      ->orWhereRaw( 'UPPER(name_en) LIKE ?', array('%'.$match.'%'))
						      ->orWhereRaw( 'UPPER(name_es) LIKE ?', array('%'.$match.'%'))
						      ->orWhereRaw( 'UPPER(name_fr) LIKE ?', array('%'.$match.'%'));
					});
				}
			}
		});

		return $query;
	}

	public function scopeSearch( $query, $term, $or = false ) {
		return self::searchQuery( $query, $term, $or );
	}

	public static function sortSearchResult( Illuminate\Database\Eloquent\Collection $collection, $searchterm ) {
		if( strlen( $searchterm ) < 3 ) {
			return $collection->sort( function( Item $a, Item $b ) {
				return strcmp( $a->getName(), $b->getName() );
			});
		}

		$cache = array();

		$collection->sort( function( Item $a, Item $b ) use ( $searchterm, &$cache ) {
			if( $a->getName( ) == $searchterm ) return  1;
			if( $b->getName( ) == $searchterm ) return -1;

			$parts = explode( ' ', $searchterm );

			$scoreA = isset( $cache[$a->id] )
				? $cache[$a->id]
				: ( $cache[$a->id] = round( $a->getScore( $parts )));
			$scoreB = isset( $cache[$b->id] )
				? $cache[$b->id]
				: ( $cache[$b->id] = round( $b->getScore( $parts )));
			
			if( $scoreA == $scoreB )
				return strcmp( $a->getName(), $b->getName() );

			return $scoreB - $scoreA;
		});
		return $collection;
	}

	public function getScore( $searchtermParts ) {
		$score = 0;

		foreach( array('de', 'en', 'es', 'fr') as $lang ) {
			$modifier = $lang == App::getLocale() ? 1 : 0.1;
			$name = mb_strtoupper( $this->getName( $lang ));
			$nameParts = explode( ' ', $name );

			foreach ($searchtermParts as $part) {
				$part = mb_strtoupper( $part );

				if( starts_with( $name, $part )) {
					$score += 5 * $modifier;
				}

				foreach ($nameParts as $namePart) {

					if( $namePart == $part ) {
						$score += 5 * $modifier;
					} else if ( starts_with( $namePart, $part )) {
						$score += 3 * $modifier;
					}
				}
			}
		}

		return $score;
	}

	public function getSimilarItems() {
		$that = $this;
		return Item::where( 'id', '!=', $this->id )
		           ->where( function( $query ) use ( $that ) {
		            	return $query->where( 'name_de', '=', $that->getName( 'de' ))
		            	           ->orWhere( 'name_en', '=', $that->getName( 'en' ))
		            	           ->orWhere( 'name_es', '=', $that->getName( 'es' ))
		            	           ->orWhere( 'name_fr', '=', $that->getName( 'fr' ))
		            	           ->orWhere( function( $q ) use ( $that ) {
		            	            	return $q->where( 'signature', '=', $that->signature )
		            	            	         ->where( 'file_id',   '=', $that->file_id ); } )
		            	           ->orWhere( function( $q ) use ( $that ) {
		            	            	return $q->where( 'type',    '=', $that->type )
		            	            	         ->where( 'subtype', '=', $that->subtype )
		            	            	         ->where( 'weight',  '=', $that->weight )
		            	            	         ->where( 'rarity',  '=', $that->rarity )
		            	            	         ->where( 'value',   '=', $that->value )
		            	            	         ->where( 'level',   '=', $that->level ); } );
		            	})->get();
	}

	//----

	public function getTooltip( $lang = null ) {
		$key = 'itemtooltip-' . ( is_null( $lang ) ? App::getLocale() : $lang ) . '-' . $this->id;
		if( Cache::has( $key )  && !isset( $_GET['nocache'] )) {
			return Cache::get( $key );
		} else {
			$tooltip = View::make( 'item.tooltip', array( 'item' => $this ))->render();
			$tooltip = str_replace( array( "\r", "\n", "\t" ), '', $tooltip );
			Cache::forever( $key, $tooltip );
			return $tooltip;
		}
	}

	public function getInfixUpgrade( $lang = null ) {
		if ( isset( $this->getTypeData( $lang )->infix_upgrade ))
			return $this->getTypeData( $lang )->infix_upgrade;
		return null;
	}

	/**
	 * @return array ['Precision': 5, 'OtherAttribute': 12]
	 **/
	public function getAttributes( ) {
		$attributes = $this->getInfixAttributes( );
		foreach ($this->getBuffDescriptionAttributes() as $attribute => $modifier) {
			if( array_key_exists($attribute, $attributes) )
				$attributes[ $attribute ] += $modifier;
			else
				$attributes[ $attribute ] = $modifier;
		}
		return $attributes;
	}

	/**
	 * Returns the attributes from infix_upgrade.attributes
	 **/
	public function getInfixAttributes( ) {
		$infixUpgrade = $this->getInfixUpgrade( 'en' );
		if( is_null( $infixUpgrade ) || !isset( $infixUpgrade->attributes ) )
			return array();
		$attributes = array();
		foreach ($infixUpgrade->attributes as $attribute) {
			$attributes[ $attribute->attribute ] = $attribute->modifier;
		}
		return $attributes;
	}

	/**
	 * Parses infix_upgrade.buff.description and returns the attributes
	 **/
	public function getBuffDescriptionAttributes( ) {
		$infixUpgrade = $this->getInfixUpgrade( 'en' );
		if( is_null( $infixUpgrade ) || !isset( $infixUpgrade->buff ) || !isset( $infixUpgrade->buff->description ))
			return array();

		$infixUpgradeLocalized = $this->getInfixUpgrade( );

		$attributes = array();
		$buffs = explode("\n", $infixUpgrade->buff->description);
		$buffsLocalized = explode("\n", $infixUpgradeLocalized->buff->description);

		foreach ($buffs as $i => $buff) {
			if( preg_match('/^\+?([0-9]+)%? (\S+(\s\S+)?)$/', $buff, $matches) ) {
				$modifier = $matches[1];
				$attribute = $matches[2];
				$modifier = intval( str_replace( array('+', '%'), array(' ', ' '), $modifier ) );
				$attribute = str_replace( array( 'Critical Damage', 'Healing Power', ' ' ),
				                          array( 'CritDamage',      'Healing',       '' ), 
				                          $attribute );
				$attributes[ $attribute ] = $modifier; 
			} else {
				$attributes[ ] = $buffsLocalized[ $i ];
			}
		}

		return $attributes;
	}

	/**
	 * Parses [type].description and returns the attributes
	 **/
	public function getConsumableAttributes( $lang = null ) {
		if( !isset( $this->getTypeData( $lang )->description )) {
			return array();
		}

		$description = $this->getTypeData( $lang )->description;
		$description = str_replace( chr(194).chr(160), ' ', $description );

		$attributes = array();
		$buffs = explode("\n", $description);

		foreach ($buffs as $i => $buff) {
			if( preg_match('/^(\+?-?[0-9]+%?) (.*)$/', $buff, $matches) ) {
				$modifier = $matches[1];
				$attribute = $matches[2];
				$modifier = str_replace( '-', '−', $modifier );
				$attributes[ $attribute ] = $modifier;
			} else {
				$attributes[ ] = $buff;
			}
		}

		return $attributes;
	}

	private function localized( $property, $lang ) {
		if( is_null( $lang ) ) $lang = App::getLocale();
		if( $lang != 'de' && $lang != 'en' && 
			$lang != 'es' && $lang != 'fr' )
			return 'Invalid language: ' . $lang;
		$localizedProperty = $property . '_' . $lang;
		if( isset($this->{$localizedProperty}) ) {
			return $this->{$localizedProperty};
		} else if ( isset($this->{$property}) ) {
			return 'Property is not localized: ' . $property;
		} else {
			return 'Unknown property: ' . $property;
		}
	}

	//----

	public function getAttributeIsPercentual( $attribute ) {
		return in_array( $attribute, array(
			'AgonyResistance',
			'BoonDuration',
			'ConditionDuration',
			'CritDamage',
			'Damage'
		));
	}
}