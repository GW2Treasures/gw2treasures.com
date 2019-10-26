<?php

/**
 * @property AchievementCategory category
 */
class Achievement extends BaseModel implements IHasIcon, IHasLink {
    const FLAG_CATEGORY_DISPLAY = 'CategoryDisplay';
    const FLAG_HIDDEN = 'Hidden';
    const FLAG_IGNORE_NEARLY_COMPLETE = 'IgnoreNearlyComplete';
    const FLAG_MOVE_TO_TOP = 'MoveToTop';
    const FLAG_PVP = 'Pvp';
    const FLAG_REPAIR_ON_LOGIN = 'RepairOnLogin';
    const FLAG_REPEATABLE = 'Repeatable';
    const FLAG_REQUIRES_UNLOCK = 'RequiresUnlock';

	use HasLocalizedData, HasIcon, HasLink;

    /**
     * Checks if the specified flag is set for this achievement.
     *
     * @param string $flag
     * @return bool
     */
	public function hasFLag($flag) {
	    return in_array($flag, $this->getData()->flags);
    }

    public function highlightLockedText($lang = null) {
        if($lang === null) {
            $lang = App::getLocale();
        }

        return Cache::remember('achievement.locked_text.'.$this->id.$lang, 120, function() use ($lang) {
            $locked_text = $this->getData('en')->locked_text;

            // items
            if(preg_match('/^(Purchase|Loot|Use|Bring|Acquire)( an?| the|) (.*?)( from|, found|, obtained| to| by combining)/', $locked_text, $matches)) {
                $itemName = $matches[3];

                $items = Item::where('name_en', '=', $itemName)->get();

                if($items->count() > 1) {
                    $bitIds = array_map(function($bit) {
                        return $bit->type === 'Item' ? $bit->id : null;
                    }, $this->getData()->bits);

                    $items = $items->filter(function($item) use ($bitIds) {
                        return in_array($item->id, $bitIds);
                    });
                }

                if($items->count() === 1) {
                    /** @var Item $item */
                    $item = $items->first();
                    return str_ireplace($item->getName($lang), $item->link(null), $this->getData($lang)->locked_text);
                }
            }

            // achievements
            if(preg_match('/^(Complete|Unlocks a short time after completing)( the|) (.*?)( collection|, then)/', $locked_text, $matches)) {
                $achievementName = $matches[3];

                $achievements = Achievement::where('name_en', '=', $achievementName)->orWhere('name_en', 'LIKE', $achievementName.':%')->get();

                if($achievements->count() === 1) {
                    /** @var Achievement $achievement */
                    $achievement = $achievements->first();

                    // sometimes achievements with ":" in the name are only referenced to by the first part
                    // also normalize the horrible french translation
                    $partialAchievementName = trim(str_replace(chr(194).chr(160), ' ', explode(':', $achievement->getName($lang))[0]));

                    return str_ireplace([$achievement->getName(), $partialAchievementName], $achievement->link(null), str_replace(chr(194).chr(160), ' ', $this->getData($lang)->locked_text));
                }
            }

            return $this->getData($lang)->locked_text;
        });
    }

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

	public function getIconUrl($size = 64) {
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

	public function getAdditionalLinkAttributes(array $defaults = []) {
		return ['data-achievement-id' => $this->id];
	}

	public function getUrl($lang = null) {
		if(is_null($lang)) {
			$lang = App::getLocale();
		}
		return route('achievement.details', ['language' => $lang, 'achievement' => $this->id]);
	}

	public function category() {
		return $this->belongsTo(AchievementCategory::class, 'achievement_category_id');
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

    public function prerequisites() {
        return $this->belongsToMany(Achievement::class, 'achievement_prerequisites', 'achievement_id', 'prerequisite_id');
    }

    public function prerequisiteFor() {
        return $this->belongsToMany(Achievement::class, 'achievement_prerequisites', 'prerequisite_id', 'achievement_id');
    }

	public function getTotalPoints() {
		$points = 0;

		foreach( $this->getData()->tiers as $tier ) {
			$points += $tier->points;
		}

		return $points;
	}
}
