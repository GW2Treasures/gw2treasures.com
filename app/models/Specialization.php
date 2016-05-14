<?php

class Specialization extends BaseModel {
	use HasLocalizedData, HasIcon, HasLink;

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

	public function getIconUrl($size = 64) {
		return $this->getInternalIconUrl($size, $this->signature, $this->file_id);
	}

	protected function getAdditionalLinkAttributes(array $defaults = []) {
		return ['data-specialization-id' => $this->id];
	}

	public function getUrl($lang = null) {
		if(is_null($lang)) {
			$lang = App::getLocale();
		}

		return URL::route('specialization.details', ['language' => $lang, 'specialization' => $this->id]);
	}

	public function profession() {
		return $this->belongsTo(Profession::class);
	}

    public function traits() {
        return $this->hasMany(Traits::class);
    }

    public function getTrait($id) {
        if(!isset($this->traitsById)) {
            $this->traitsById = $this->traits->keyBy('id');
        }

        return $this->traitsById->get($id);
    }
}
