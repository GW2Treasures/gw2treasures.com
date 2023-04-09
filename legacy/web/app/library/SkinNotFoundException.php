<?php

class SkinNotFoundException extends Exception {
	public $skin_id;

	public function __construct( $skin_id ) {
		$this->skin_id = $skin_id;
	}
}