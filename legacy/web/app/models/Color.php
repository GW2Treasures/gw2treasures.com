<?php

class Color extends BaseModel {
	use HasLocalizedData;

	public function getName( $lang = null ) {
		return $this->localized( 'name', $lang );
	}

    public function getColor($material) {
        if(!in_array($material, ['base', 'cloth', 'leather', 'metal', 'fur'])) {
            throw new Exception("Invalid material $material to get color.");
        }

	    $rgb = $this->getData()->{$material}->rgb;
        return '#'.Color::toHex(($rgb[0] << 16) | ($rgb[1] << 8) | $rgb[2]);
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
