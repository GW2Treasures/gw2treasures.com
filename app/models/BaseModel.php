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
     *
     * @throws Exception
     */
    protected function localized($property, $lang = null) {
        if(is_null($lang)) {
            $lang = App::getLocale();
        }

        if(!in_array($lang, ['de', 'en', 'es', 'fr'])) {
            throw new Exception('Invalid language: '.$lang);
        }

        $localizedProperty = $property.'_'.$lang;

        if(isset($this->{$localizedProperty})) {
            return $this->{$localizedProperty};
        }

        if(isset($this->{$property})) {
            throw new Exception('Property is not localized: '.$property);
        }

        throw new Exception('Unknown property: '.$property);
    }

    /**
     * @return string
     */
    public function __toString() {
        return '[Model (' . get_class( $this ) . ': ' . $this->attributes[ $this->primaryKey ] . ')]';
    }
}
