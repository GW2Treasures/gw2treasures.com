<?php

class AchievementCategory extends BaseModel implements IHasIcon, IHasLink {
	use HasLocalizedData, HasIcon, HasLink;

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

	public function getDescription($lang = null) {
		return $this->localized('description', $lang);
	}

	public function getIconUrl($size = 64) {
		return $this->getInternalIconUrl(64, $this->signature, $this->file_id);
	}

	public function achievements() {
		return $this->hasMany(Achievement::class, 'achievement_category_id', 'id');
	}

	public function group() {
		return $this->belongsTo(AchievementGroup::class, 'achievement_group_id');
	}

	public function getUrl($lang = null) {
		return route('achievement.category', [$lang, $this->id]);
	}
}
