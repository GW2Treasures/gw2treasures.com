<?php

class Currency extends BaseModel {
	use HasLocalizedData, HasIcon;

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

	public function getDescription($lang = null) {
	    return $this->formatForDisplay($this->getData($lang)->description);
    }

    public function getIconUrl($size = 64) {
        return $this->getInternalIconUrl($size, $this->signature, $this->file_id);
    }
}
