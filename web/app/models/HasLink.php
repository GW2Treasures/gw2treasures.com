<?php

trait HasLink {
    public abstract function getUrl($lang = null);

    public function getAdditionalLinkAttributes(array $defaults = []) {
        return [];
    }

    protected function isRemovedFromApi() {
        return isset($this->removed_from_api) && $this->removed_from_api;
    }

    abstract function getName($lang);

    public function link($icon = 16, $lang = null, $text = null, $anchor = null, $extraAttributes = []) {
        if(is_null($lang)) {
            $lang = App::getLocale();
        }

        if(is_null($text)) {
            $text = $this->getName($lang);
        }

        $displayIcon = is_int($icon) && $icon > 0;

        $anchor = !is_null($anchor) && $anchor !== ''
            ? '#'.$anchor
            : '';

        $defaultAttributes = $this->getDefaultLinkAttributes($icon, $lang, $this->getUrl($lang).$anchor, $displayIcon);

        $attributes = $extraAttributes + $this->getAdditionalLinkAttributes($defaultAttributes) + $defaultAttributes;

        $openTag = '<a '.HTML::attributes($attributes).'>';
        $closeTag = '</a>';

        $icon = $displayIcon ? $this->getIcon($icon) : '';
        $text = "<span class=\"item-link-text\">$text</span>";

        return $openTag.$icon.$text.$closeTag;
    }

    /**
     * @param $icon
     * @param $lang
     * @param $anchor
     * @param $displayIcon
     * @return array
     */
    public function getDefaultLinkAttributes($icon, $lang, $href, $displayIcon) {
        $defaultAttributes = [
            'class' => 'item-link'
                .($displayIcon ? ' item-link-'.$icon : '')
                .($this->isRemovedFromApi() ? ' removed' : ''),
            'href' => $href,
            'hreflang' => $lang,
        ];

        return $defaultAttributes;
    }
}
