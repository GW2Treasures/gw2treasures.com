<?php

class AchievementGroup extends BaseModel {
	use HasLocalizedData;

	public $incrementing = false;

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

	public function getDescription($lang = null) {
		return $this->localized('description', $lang);
	}

	public function categories() {
		return $this->hasMany(AchievementCategory::class, 'achievement_group_id', 'id');
	}
}
