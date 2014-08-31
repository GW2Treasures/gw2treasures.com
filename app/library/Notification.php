<?php

class Notification {
	protected $name;
	protected $content;
	protected $options = array();

	private static $default_options = array(
		'dismissible' => true,
		'data' => array()
	);

	private function __construct( $name, $content, $options ) {
		$this->name = $name;
		$this->content = $content;
		$this->options = array_merge( self::$default_options, $options );
	}

	public function getName() { return $this->name; }
	public function getContent() { return $this->content; }
	public function getOption( $key ) {
		if( array_key_exists( $key, $this->options )) {
			return $this->options[ $key ];
		} elseif( array_key_exists( $key, self::$default_options )) {
			return self::$default_options[ $key ];
		} else {
			return null;
		}
	}
	public function isDismissible() { return $this->getOption( 'dismissible' ); }

	public function getData() { 
		$data = $this->getOption('data');
		return is_array( $data ) ? $data : array();
	}

	//----

	public static function Add( $p1, $p2 = null, $p3 = null ) {
		if ( !is_null( $p3 ) || ( is_null( $p3 ) && is_string( $p2 ) )) {
			return self::AddNamed( $p1, $p2, $p3 );
		} else {
			return self::AddAnonym( $p1, $p2 );
		}
	}
	private static function AddNamed( $name, $content, $options = null ) {
		if( is_null( $options ) ) $options = array();

		$n = new Notification( $name, $content, $options );

		self::Notifications();
		self::$notifications[ $name ] = $n;
		self::Save();
	}
	private static function AddAnonym( $content, $options = null ) {
		if( is_null( $options ) ) $options = array();

		$n = new Notification( '', $content, $options );

		self::Notifications();
		self::$notifications[ ] = $n;

		end( self::$notifications );
		$id = key( self::$notifications );
		$n->name = $id;

		self::Save();
	}


	public static function Remove( $key ) {
		self::Notifications();
		unset( self::$notifications[ $key ] );
		self::Save();
	}

	public static function Clear( ) {
		self::$notifications = array();
		self::Save();
	}

	public static function has( $key ) {
		return array_key_exists( $key, self::Notifications() );
	}

	private static $notifications = null;
	public static function Notifications() {
		if( is_null( self::$notifications ) ) {
			self::$notifications = unserialize( Session::get( 'notifications', serialize( array() ) ) );
		}
		//dd( self::$notifications );
		return self::$notifications;
	}

	public static function Save() {
		Session::put( 'notifications', serialize( self::Notifications() ));
		Session::save();
	}
}