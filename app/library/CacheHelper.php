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
}