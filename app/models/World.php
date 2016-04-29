<?php

class World extends BaseModel {
	public function getUrl($lang = null) {
		if($lang === null) {
			$lang = App::getLocale();
		}

		return route('wvw.world', [$lang, $this->id]);
	}

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
