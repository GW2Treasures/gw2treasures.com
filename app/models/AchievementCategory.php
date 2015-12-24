<?php

class AchievementCategory extends BaseModel {
	use HasLocalizedData, HasIcon;

	public function getName( $lang = null ) {
		return $this->localized( 'name', $lang );
	}

	public function getIconUrl($size = 64) {
		return $this->getInternalIconUrl(64, $this->signature, $this->file_id);
	}

	public function achievements() {
		return $this->hasMany( Achievement::class, 'achievement_category_id', 'id' );
	}
}
