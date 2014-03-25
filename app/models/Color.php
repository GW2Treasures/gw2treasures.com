<?php

class Color extends BaseModel {
	public function getName( $lang = null ) {
		if( is_null( $lang )) {
			$lang = App::getLocale();
		}
		return $this->{ 'name_' . $lang };
	}

	public static function toColor( $c ) {
		return substr( '000000'.dechex( $c ), -6 );
	}

	public static function readableForecolor( $c ) {
		$r = $c >> 16 & 0xFF;
		$g = $c >>  8 & 0xFF;
		$b = $c >>  0 & 0xFF;

		$contrast = sqrt($r * $r * .241 + $g * $g * .691 + $b * $b * .068);

		return $contrast > 130 ? '#111' : '#EEE';
	}
}