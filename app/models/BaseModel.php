<?php

class BaseModel extends Eloquent {
	public function scopeRandom( $query, $count = 1 ) {
		$count = max( 1, $count );
		$table = $this->getTable();

		return $query->whereRaw( 'RAND() < ( SELECT (( ' . $count . ' / COUNT(*)) * 10) FROM ' . $table . ' )' )
		             ->orderBy( DB::raw( 'RAND()' ))
		             ->limit( $count );
	}

	protected function localized( $property, $lang ) {
		if( is_null( $lang ) ) $lang = App::getLocale();
		if( $lang != 'de' && $lang != 'en' && 
			$lang != 'es' && $lang != 'fr' )
			return 'Invalid language: ' . $lang;
		$localizedProperty = $property . '_' . $lang;
		if( isset($this->{$localizedProperty}) ) {
			return $this->{$localizedProperty};
		} else if ( isset($this->{$property}) ) {
			return 'Property is not localized: ' . $property;
		} else {
			return 'Unknown property: ' . $property;
		}
	}

	public function __toString() {
		return '[Model (' . get_class( $this ) . ': ' . $this->attributes[ $this->primaryKey ] . ')]';
	}
}