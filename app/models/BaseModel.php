<?php

class BaseModel extends Eloquent {
	public function scopeRandom( $query, $count = 1 ) {
		$count = max( 1, $count );
		$table = $this->getTable();

		return $query->whereRaw( 'RAND() < ( SELECT (( ' . $count . ' / COUNT(*)) * 10) FROM ' . $table . ' )' )
		             ->orderBy( DB::raw( 'RAND()' ))
		             ->limit( $count );
	}
}