<?php

use GW2Treasures\GW2Tools\Chatlinks\TraitChatlink;

class Traits extends BaseModel implements IHasIcon, IHasLink {
	use HasLocalizedData, HasIcon, HasLink;

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

    public function getDescription($lang = null) {
        return $this->localized('description', $lang);
    }

    public function getFacts($lang=null) {
        $data = $this->getData($lang);
        return isset($data->facts) ? $data->facts : [];
    }

    public function hasFacts() {
        return !empty($this->getFacts());
    }

    public function getTraitedFacts($lang=null) {
        $data = $this->getData($lang);
        return isset($data->traited_facts) ? $data->traited_facts : [];
    }

    public function hasTraitedFacts() {
        return !empty($this->getTraitedFacts());
    }

    public function getSkills($lang=null) {
        $data = $this->getData($lang);
        return isset($data->skills) ? $data->skills : [];
    }

	public function getIconUrl($size = 64) {
		return $this->getInternalIconUrl($size, $this->signature, $this->file_id);
	}

	protected function getAdditionalLinkAttributes(array $defaults = []) {
		return ['data-trait-id' => $this->id];
	}

	public function getUrl($lang = null) {
		if(is_null($lang)) {
			$lang = App::getLocale();
		}

		return URL::route('trait.details', ['language' => $lang, 'trait' => $this->id]);
	}

	public function getChatlink() {
		return (new TraitChatlink($this->id))->encode();
	}

    public function getFactIcon($size, $icon) {
        $attributes = [
            'src' => $this->getFactIconUrl($size, $icon),
            'width' => $size,
            'height' => $size,
            'alt' => '',
            'crossorigin' => 'anonymous'
        ];

        if($size <= 32) {
            $attributes['srcset'] = $this->getFactIconUrl($size*2, $icon).' 2x';
        }

        return '<img '.HTML::attributes($attributes).'>';
    }

    public function getFactIconUrl($size, $icon) {
        preg_match('/\/(?<signature>[^\/]*)\/(?<file_id>[^\/]*)\.png$/', $icon, $icon);

        return $this->getInternalIconUrl($size, $icon['signature'], $icon['file_id']);
    }

    public function requiresTraits() {
        return $this->belongsToMany(Traits::class, 'traits_required', 'required_trait_id', 'trait_id');
    }

    public function requiredForTraits() {
        return $this->belongsToMany(Traits::class, 'traits_required', 'trait_id', 'required_trait_id');
    }

    public function requiredForSkills() {
        return $this->belongsToMany(Skill::class, 'skill_traits', 'skill_id', 'required_trait_id');
    }

	public function specialization() {
		return $this->belongsTo(Specialization::class, 'specialization_id', 'id');
	}
}
