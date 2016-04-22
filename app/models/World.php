<?php

class World extends BaseModel {
	public function getName( $lang = null ) {
		return $this->localized( 'name', $lang );
	}

	public function matches() {
		return Match::hasWorld( $this );
	}

	public function currentMatch() {
		return $this->belongsTo(Match::class, 'match_id');
	}
}
