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
		echo 'Setting Skin';
		Item::where('skin_id','=','0')->chunk( 500, function( $items ) {
			/** @var Item[] $items */
			foreach( $items as $item ) {
				if( isset( $item->getData( 'en' )->default_skin ) && $item->getData( 'en' )->default_skin != $item->skin_id ) {
					$item->skin_id = $item->getData( 'en' )->default_skin;
				} elseif( isset( $item->getTypeData('en')->skins ) && count( $item->getTypeData()->skins ) > 0 ) {
					$item->skin_id = $item->getTypeData()->skins[0];
				}

				if( $item->getOriginal('skin_id') !== $item->skin_id ) {
					CacheHelper::ClearItemDetails( $item );
					CacheHelper::ClearItemTooltip( $item );
					$item->save();
				}
			}
			echo '.';
		});
		echo PHP_EOL;
		$this->info( 'done!' );
	}
}
