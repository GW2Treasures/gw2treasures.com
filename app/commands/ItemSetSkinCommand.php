<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class ItemSetSkinCommand extends Command {
	protected $name = 'gw2treasures:setskin';
	protected $description = 'Sets the skin_id based on the data';

	public function __construct() {
		parent::__construct();
	}

	public function fire() {
		Item::chunk( 500, function( $items ) {
			foreach( $items as $item ) {
				if( isset( $item->getData( 'en' )->default_skin ) ) {
					$item->skin_id = $item->getData( 'en' )->default_skin;
					$item->save();
				}
			}
		});
	}
}
