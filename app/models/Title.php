<?php

class Title extends BaseModel {
	use HasLocalizedData;

	public function getName( $lang = null ) {
		return $this->formatForDisplay($this->localized( 'name', $lang ));
	}
}
