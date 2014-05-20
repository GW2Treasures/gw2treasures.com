<?php

class CacheHelper {
	public static function ItemDetails( Item $item, $language ) {
		return 'itemdetails-' . $language . '-' . $item->id;
	}
	public static function ClearItemDetails( Item $item ) {
		foreach( array( 'de','en','es','fr' ) as $lang ) {
			Cache::forget( CacheHelper::ItemDetails( $item, $lang ));
		}
	}

	public static function ItemTooltip( Item $item, $language ) {
		return 'itemtooltip-' . $language . '-' . $item->id;
	}
	public static function ClearItemTooltip( Item $item ) {
		foreach( array( 'de','en','es','fr' ) as $lang ) {
			Cache::forget( CacheHelper::ItemTooltip( $item, $lang ));
		}
	}
}