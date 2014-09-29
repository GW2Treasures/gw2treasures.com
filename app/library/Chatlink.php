<?php
class Chatlink {

	public static $TYPES = array(
		'coin'   => 1,
		'item'   => 2,
		'text'   => 3,
		'map'    => 4,
		'skill'  => 7,
		'trait'  => 8,
		'recipe' => 10,
		'skin'   => 11,
		'outfit' => 12
	);

	public $type;
	public $id;
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

		$data = [];
		while ($id > 0) {
			$data[] = $id & 255;
			$id = $id >> 8;
		}

		while (count($data) < 4 || count($data) % 2 != 0) {
			$data[] = 0;
		}

		if ($type === 2) {
			array_unshift($data, 1);
		}
		array_unshift($data, self::$TYPES[$type]);

		// encode data
		$chatlink = '';
		for ($i = 0; $i < count($data); $i++) {
			$chatlink .= chr($data[$i]);
		}

		$this->chatlink = '[&' . base64_encode( $chatlink ) . ']';
	}

	public static function Encode( $type, $id ) {
		if( !in_array( $type, self::$TYPES )) {
			throw new Exception( 'Invalid type for Chatlink' );
		}
		return new Chatlink( $type, $id );
	}

	/**
	 * @param $chatlink
	 *
	 * @return Chatlink
	 *
	 * @throws Exception
	 *
	 * @author {@link https://twitter.com/poke poke}
	 * @link   http://ideone.com/0RSpAA
	 */
	public static function Decode( $chatlink ) {
		if(preg_match("/\[&([a-z0-9+\/]+=)\]/i", $chatlink)){
			// decode base64 and read octets
			$data = [];
			foreach(str_split(base64_decode($chatlink)) as $char){
				$data[] = ord($char);
			}

			if(!in_array($data[0], self::$TYPES)){
				// invalid type
				throw new Exception( 'Chatlink with unknown type' );
			}

			// items have the quantity first, so set an offset
			$o = $data[0] === 2 ? 1 : 0;

			// get id
			$id = $data[3 + $o] << 16 | $data[2 + $o] << 8 | $data[1 + $o];

			return new Chatlink( array_keys(self::$TYPES, $data[0])[0], $id );
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
