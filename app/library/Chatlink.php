<?php

class Chatlink {
	/** @const int */
	const TYPE_COIN   =  1;
	/** @const int */
	const TYPE_ITEM   =  2;
	/** @const int */
	const TYPE_TEXT   =  3;
	/** @const int */
	const TYPE_MAP    =  4;
	/** @const int */
	const TYPE_SKILL  =  7;
	/** @const int */
	const TYPE_TRAIT  =  8;
	/** @const int */
	const TYPE_RECIPE = 10;
	/** @const int */
	const TYPE_SKIN   = 11;
	/** @const int */
	const TYPE_OUTFIT = 12;

	/** @var array */
	public static $TYPES = array(
		'coin'   => self::TYPE_COIN,
		'item'   => self::TYPE_ITEM,
		'text'   => self::TYPE_TEXT,
		'map'    => self::TYPE_MAP,
		'skill'  => self::TYPE_SKILL,
		'trait'  => self::TYPE_TRAIT,
		'recipe' => self::TYPE_RECIPE,
		'skin'   => self::TYPE_SKIN,
		'outfit' => self::TYPE_OUTFIT
	);

	/** @var self::TYPE_COIN|self::TYPE_ITEM|self::TYPE_TEXT|self::TYPE_MAP|self::TYPE_SKILL|self::TYPE_TRAIT|self::TYPE_RECIPE|self::TYPE_SKIN */
	public $type;
	/** @var int */
	public $id;
	/** @var string */
	public $chatlink;

	/**
	 * @param string $type
	 * @param int    $id
	 *
	 * @author {@link https://twitter.com/poke poke}
	 * @link http://wiki.guildwars2.com/wiki/Widget:Game_link
	 */
	private function __construct( $type, $id ) {
		$this->type = $type;
		$this->id = $id;

		$data = array();
		while( $id > 0 ) {
			$data[] = $id & 255;
			$id = $id >> 8;
		}

		while( count($data) < 4 || count($data) % 2 !== 0 ) {
			$data[] = 0;
		}

		// add quantity if we are encoding an item
		if( $type === self::TYPE_ITEM ) {
			array_unshift( $data, 1 );
		}

		array_unshift( $data, $type );

		// encode data
		$chatlink = '';
		for( $i = 0; $i < count( $data ); $i++ ) {
			$chatlink .= chr( $data[$i] );
		}

		$this->chatlink = '[&' . base64_encode( $chatlink ) . ']';
	}

	/**
	 * @param self::TYPE_COIN|self::TYPE_ITEM|self::TYPE_TEXT|self::TYPE_MAP|self::TYPE_SKILL|self::TYPE_TRAIT|self::TYPE_RECIPE|self::TYPE_SKIN $type
	 * @param int $id
	 * @return Chatlink
	 * @throws Exception
	 */
	public static function Encode( $type, $id ) {
		if( !in_array( $type, self::$TYPES )) {
			throw new Exception( 'Invalid type for Chatlink' );
		}
		return new Chatlink( $type, $id );
	}

	/**
	 * @param string $chatlink
	 * @return Chatlink
	 * @throws Exception
	 *
	 * @author {@link https://twitter.com/poke poke}
	 * @link   http://ideone.com/0RSpAA
	 */
	public static function Decode( $chatlink ) {
		if( preg_match( '/\[&([a-z\d+\/]+=*)\]/i', $chatlink )) {
			// decode base64 and read octets
			$data = array();
			foreach( str_split( base64_decode( $chatlink )) as $char ){
				$data[] = ord( $char );
			}

			if( !in_array( $data[0], self::$TYPES )){
				// invalid type
				throw new Exception( 'Chatlink with unknown type (' . $data[0] . ')' );
			}

			// items have the quantity first, so set an offset
			$o = $data[0] === 2 ? 1 : 0;

			// get id
			$id = $data[3 + $o] << 16 | $data[2 + $o] << 8 | $data[1 + $o];

			return new Chatlink( $data[0], $id );
		} else {
			throw new Exception( 'Invalid Chatlink: ' . $chatlink );
		}
	}

	/**
	 * Tries to decode the chatlink, returns false for invalid chatlinks
	 *
	 * @param string $chatlink
	 * @return bool|Chatlink
	 */
	public static function TryDecode( $chatlink ) {
		try {
			return self::Decode( $chatlink );
		} catch( Exception $x ) {
			return false;
		}
	}
}
