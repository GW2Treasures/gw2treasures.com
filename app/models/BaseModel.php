<?php

class BaseModel extends Eloquent {
    public $timestamps = false;

    /**
     * Gets a random record
     *
     * @param Illuminate\Database\Query\Expression $query
     * @param int                                  $count
     * @return mixed
     */
    public function scopeRandom( $query, $count = 1 ) {
        $count = max( 1, $count );
        $table = $this->getTable();

        return $query->whereRaw( 'RAND() < ( SELECT (( ' . $count . ' / COUNT(*)) * 10) FROM ' . $table . ' )' )
                     ->orderBy( DB::raw( 'RAND()' ) )
                     ->limit( $count );
    }

    /**
     * Returns the localized value of a property
     *
     * @param $property
     * @param $lang
     * @return string
     */
    protected function localized( $property, $lang ) {
        if( is_null( $lang ) ) {
            $lang = App::getLocale();
        }
        if( $lang != 'de' && $lang != 'en' &&
            $lang != 'es' && $lang != 'fr'
        ) {
            return 'Invalid language: ' . $lang;
        }
        $localizedProperty = $property . '_' . $lang;
        if( isset($this->{$localizedProperty}) ) {
            return $this->{$localizedProperty};
        } else {
            if( isset($this->{$property}) ) {
                return 'Property is not localized: ' . $property;
            } else {
                return 'Unknown property: ' . $property;
            }
        }
    }

    /**
     * @return string
     */
    public function __toString() {
        return '[Model (' . get_class( $this ) . ': ' . $this->attributes[ $this->primaryKey ] . ')]';
    }
}