<?php

class Material extends BaseModel {
	use HasLocalizedData;

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}
}
