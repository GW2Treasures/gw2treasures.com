<?php

class MountType extends BaseModel {
	use HasLocalizedData, HasLink, HasIcon;

	public function defaultSkin() {
	    return $this->hasOne(MountSkin::class, 'mount');
    }

    public function skins() {
        return $this->hasMany(MountSkin::class, 'mount');
    }

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

    public function getUrl($lang = null) {
        if(is_null($lang)) {
            $lang = App::getLocale();
        }

        return route('mount.details', ['language' => $lang, 'mountType' => $this->id]);
    }

    public function getIconUrl($size = 64) {
	    return $this->defaultSkin->getIconUrl($size);
    }
}
