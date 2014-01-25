<?php

class Item extends Eloquent {
	private $d = array();

	public function getName( $lang = null ) { return $this->localized( 'name', $lang ); }
	public function getDescription( $lang = null ) { return $this->localized( 'desc', $lang ); }
	public function getData( $lang = null ) { 
		if ( !array_key_exists( $lang, $this->d ) ) {
			$this->d[ $lang ] = json_decode( $this->localized( 'data', $lang ) );
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
		return '[&'.base64_encode(chr(0x02).chr(0x01).chr($this->id%256).chr((int)($this->id/256)).chr(0x00).chr(0x00)).']';
	}
	public static function decodeChatlink( $code ) {
		$code = base64_decode( $code );
		$data = array();
		for ($i=0; $i < strlen( $code ); $i++) { 
			$data[ $i ] = ord( $code[ $i] );
		}

		// item?
		if( $data[0] != 2 ) {
			return false;
		}
		return $data[3] << 8 | $data[2];
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

	public function scopeSearch( $query, $term ) {
		$term = strtoupper( $term );
		return $query->  whereRaw( 'UPPER(name_de) LIKE ?', array('%'.$term.'%'))
		             ->orWhereRaw( 'UPPER(name_de) LIKE ?', array('%'.$term.'%'))
		             ->orWhereRaw( 'UPPER(name_de) LIKE ?', array('%'.$term.'%'))
		             ->orWhereRaw( 'UPPER(name_de) LIKE ?', array('%'.$term.'%'));
	}

	//----

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

		$attributes = array();
		$buffs = explode("\n", $infixUpgrade->buff->description);

		foreach ($buffs as $buff) {
			list( $modifier, $attribute ) = explode( ' ', $buff, 2 );
			$modifier = intval( str_replace( array('+', '%'), array(' ', ' '), $modifier ) );
			$attribute = str_replace( array( 'Critical Damage', 'Healing Power', ' ' ),
			                          array( 'CritDamage',      'Healing',       '' ), 
			                          $attribute );
			$attributes[ $attribute ] = $modifier; 
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
}