<?php

class ItemNotFoundException extends Exception {
	public $itemId;

	public function __construct( $itemId ) {
		$this->itemId = $itemId;
	}
}