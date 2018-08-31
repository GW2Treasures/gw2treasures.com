<?php

class Mini extends BaseModel {
	use HasLocalizedData, HasIcon;

	public function item() {
	    return $this->belongsTo(Item::class);
    }

	public function getName($lang = null) {
		return $this->localized('name', $lang);
	}

	public function getUnlock($lang = null) {
	    return $this->formatForDisplay($this->localized('unlock', $lang));
    }

    public function getIconUrl($size = 64) {
        return $this->getInternalIconUrl($size, $this->signature, $this->file_id);
    }

    protected function formatForDisplay($subject) {
        $replacements = [
            '/<c=@([^>]+)>(.*?)<\/?c>/s' => '<span class="color-format-$1">$2</span>',
            '/<c=#([^>]+)>(.*?)<\/?c>/s' => '<span class="color-format" style="color:#$1">$2</span>',
            '/\n/' => '<br>'
        ];
        return preg_replace(array_keys($replacements), array_values($replacements), $subject);
    }
}
