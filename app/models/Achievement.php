<?php

class Achievement extends BaseModel {
	use HasLocalizedData, HasIcon, HasLink;

	public function getName( $lang = null ) {
		return $this->localized( 'name', $lang );
	}

	public function getIconUrl( $size = 64 ) {
		if($this->file_id == 0) {
			if(!is_null($this->category)) {
				return $this->category->getIconUrl($size);
			}

			// daily achievements have no icon if they were loaded while they were not active
			$this->signature = '483E3939D1A7010BDEA2970FB27703CAAD5FBB0F';
			$this->file_id = 42684;
		}

		return $this->getInternalIconUrl($size, $this->signature, $this->file_id);
	}

	protected function getAdditionalLinkAttributes(array $defaults = []) {
		return ['data-achievement-id' => $this->id];
	}

	public function getUrl($lang = null) {
		if( is_null( $lang ) ) {
			$lang = App::getLocale();
		}
		return URL::route( 'achievement.details', array( 'language' => $lang, 'achievement' => $this->id ) );
	}

	public function category() {
		return $this->belongsTo( AchievementCategory::class, 'achievement_category_id' );
	}

	/**
	 * @param Illuminate\Database\Query\Builder $query
	 * @param int $itemId
	 * @return \Illuminate\Database\Query\Builder
	 */
	public function scopeRequiresItem($query, $itemId) {
		return $this->scopeRequiresByType($query, 'item', $itemId);
	}

	/**
	 * @param Illuminate\Database\Query\Builder $query
	 * @param int $itemId
	 * @return \Illuminate\Database\Query\Builder
	 */
	public function scopeRewardsItem($query, $itemId) {
		return $this->scopeRewardsByType($query, 'item', $itemId);
	}

	/**
	 * @param Illuminate\Database\Query\Builder $query
	 * @param int $itemId
	 * @return \Illuminate\Database\Query\Builder
	 */
	public function scopeRequiresSkin($query, $itemId) {
		return $this->scopeRequiresByType($query, 'skin', $itemId);
	}

	/**
	 * @param Illuminate\Database\Query\Builder $query
	 * @param int $itemId
	 * @return \Illuminate\Database\Query\Builder
	 */
	public function scopeRewardsSkin($query, $itemId) {
		return $this->scopeRewardsByType($query, 'skin', $itemId);
	}

	/**
	 * @param \Illuminate\Database\Query\Builder $query
	 * @param string $type
	 * @param int $id
	 * @return \Illuminate\Database\Query\Builder
	 */
	public function scopeRequiresByType($query, $type, $id) {
		return $query->whereExists(function($query) use ($type, $id) {
			$query->select(DB::raw(1))
				->from('achievement_objectives')
				->whereRaw('achievement_id = achievements.id')
				->where('type', '=', $type)
				->where('entity_id', '=', $id);
		});
	}

	/**
	 * @param \Illuminate\Database\Query\Builder $query
	 * @param string $type
	 * @param int $id
	 * @return \Illuminate\Database\Query\Builder
	 */
	public function scopeRewardsByType($query, $type, $id) {
		return $query->whereExists(function($query) use ($type, $id) {
			$query->select(DB::raw(1))
				->from('achievement_rewards')
				->whereRaw('achievement_id = achievements.id')
				->where('type', '=', $type)
				->where('entity_id', '=', $id);
		});
	}

	public function getTotalPoints() {
		$points = 0;

		foreach( $this->getData()->tiers as $tier ) {
			$points += $tier->points;
		}

		return $points;
	}
}
