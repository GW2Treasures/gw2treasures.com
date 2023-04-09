<?php

class Currency extends BaseModel {
	use HasLocalizedData, HasIcon, HasLink;

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

	public function getDescription($lang = null) {
	    return $this->formatForDisplay($this->getData($lang)->description);
    }

    public function getIconUrl($size = 64) {
        return $this->getInternalIconUrl($size, $this->signature, $this->file_id);
    }

    public function getUrl($lang = null) {
        if(is_null($lang)) {
            $lang = App::getLocale();
        }

        return route('currency.details', ['language' => $lang, 'currency' => $this->id]);
    }
}
