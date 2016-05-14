<?php

class Profession extends BaseModel {
	use HasLocalizedData, HasIcon, HasLink;

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

	public function getIconUrl($size = 64) {
		return $this->getInternalIconUrl($size, $this->signature, $this->file_id);
	}

	protected function getAdditionalLinkAttributes(array $defaults = []) {
		return ['data-profession-id' => $this->id];
	}

	public function getUrl($lang = null) {
		if(is_null($lang)) {
			$lang = App::getLocale();
		}

		return route('profession.details', ['language' => $lang, 'profession' => $this->id]);
	}

	public function specializations() {
		return $this->hasMany(Specialization::class);
	}
}
