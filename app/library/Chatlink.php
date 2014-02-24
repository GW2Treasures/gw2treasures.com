<?php
class Chatlink {
	const TYPE_ITEM   = "\x02\x01";
	const TYPE_MAP    = "\x04";
	const TYPE_SKILL  = "\x07";
	const TYPE_TRAIT  = "\x08";
	const TYPE_RECIPE = "\x0A";

	public static $TYPES = array(
		'item'   => self::TYPE_ITEM,
		'map'    => self::TYPE_MAP,
		'skill'  => self::TYPE_SKILL,
		'trait'  => self::TYPE_TRAIT,
		'recipe' => self::TYPE_RECIPE
	);

	public $type;
	public $id;
	public $chatlink;

	private function __construct( $type, $id ) {
		$this->type = $type;
		$this->id = $id;

		$chatlink  = $this->type;
		$chatlink .= chr( $this->id & 255 );
		$chatlink .= chr( $this->id >> 8 );
		$chatlink .= chr(0).chr(0);
		$this->chatlink = '[&' . base64_encode( $chatlink ) . ']';
	}

	public static function Encode( $type, $id ) {
		if( !in_array( $type, self::$TYPES )) {
			throw new Exception( 'Invalid type for Chatlink' );
		}
		return new Chatlink( $type, $id );
	}

	public static function Decode( $chatlink ) {
		$matches = array();
		if( preg_match( '/\\[&([A-Za-z0-9+]+=*)\\]/', $chatlink, $matches )) {
			$code = base64_decode( $matches[1] );

			$index = 0;
			$type = $code[ $index++ ];
			if( !in_array( $type, self::$TYPES )) {
				$type .= $code[ $index++ ];

				if( !in_array( $type, self::$TYPES )) {
					throw new Exception( 'Chatlink with unknown type' );
				}
			}

			$id  = ord( $code[ $index + 1 ] ) << 8 | ord( $code[ $index + 0 ] );

			return new Chatlink( $type, $id );
		} else {
			throw new Exception( 'Invalid Chatlink: ' . $chatlink );
		}
	}

	public static function TryDecode( $chatlink ) {
		try {
			return self::Decode( $chatlink ); 
		} catch( Exception $x ) {
			return false;
		}
	}
}