<?php

class Map extends BaseModel {
	use HasLocalizedData;

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

    public function getRegionName($lang = null) {
        return $this->localized('region_name', $lang);
    }

    public function getContinentName($lang = null) {
        return $this->localized('continent_name', $lang);
    }
}
