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
        return $this->belongsToMany(Match::class, 'match_worlds')->withPivot('team');
	}
}
