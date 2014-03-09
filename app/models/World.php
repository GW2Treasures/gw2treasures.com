<?php

class World extends BaseModel {
	public function getName( $lang = null ) {
		if( is_null( $lang )) {
			$lang = App::getLocale();
		}
		return $this->{ 'name_' . $lang };
	}

	public function matches() {
		return Match::hasWorld( $this );
	}
}