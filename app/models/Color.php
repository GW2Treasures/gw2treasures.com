<?php

class Color extends BaseModel {
	private $_d = array();

	public function getName( $lang = null ) {
		return $this->localized( 'name', $lang );
	}

	public function getData( $lang = null ) { 
		if ( !array_key_exists( $lang, $this->_d )) {
			$this->_d[ $lang ] = json_decode( 
				str_replace( array( '<br>' ),
				             array( '\n'   ),
				             $this->localized( 'data', $lang )));
		}
		return $this->_d[ $lang ];
	}

	public static function toHex( $c ) {
		return substr( '000000'.dechex( $c ), -6 );
	}

	public static function isDark( $c ) {
		$r = $c >> 16 & 0xFF;
		$g = $c >>  8 & 0xFF;
		$b = $c >>  0 & 0xFF;

		$contrast = sqrt($r * $r * .241 + $g * $g * .691 + $b * $b * .068);

		return $contrast <= 130;
	}
}