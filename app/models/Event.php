<?php

class Event extends BaseModel implements IHasIcon, IHasLink {
	use HasLocalizedData, HasIcon, HasLink;

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

	public function getNameWithoutDot($lang = null) {
	    $name = $this->getName($lang);

	    if(ends_with($name, '.')) {
	        return substr($name, 0, -1);
        }
    }

	public function getIconUrl($size = 64) {
	    if(!$this->signature || !$this->file_id) {
	        return $this->getInternalIconUrl($size, '98EB189CADF825549B187C57B551CE1AA29CA694', 102320);
        }

		return $this->getInternalIconUrl($size, $this->signature, $this->file_id);
	}

    public function getAdditionalLinkAttributes(array $defaults = []) {
		return ['data-event-id' => $this->id];
	}

	public function getUrl($lang = null) {
		if(is_null($lang)) {
			$lang = App::getLocale();
		}

		return route('event.details', ['language' => $lang, 'event' => $this->id]);
	}
}
