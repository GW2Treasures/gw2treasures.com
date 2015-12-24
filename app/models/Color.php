<?php

class Color extends BaseModel {
	use HasLocalizedData;

	public function getName( $lang = null ) {
		return $this->localized( 'name', $lang );
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
