<?php

class MountSkin extends BaseModel {
	use HasLocalizedData, HasIcon, HasLink;

	public function mountType() {
	    return $this->belongsTo(MountType::class, 'mount');
    }

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

    public function getIconUrl($size = 64) {
        return $this->getInternalIconUrl($size, $this->signature, $this->file_id);
    }

    public function getUrl($lang = null) {
        if(is_null($lang)) {
            $lang = App::getLocale();
        }

        return route('mount.skin.details', ['language' => $lang, 'mountSkin' => $this->id]);
    }
}
