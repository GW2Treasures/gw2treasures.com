<?php

trait HasLink {
    public abstract function getUrl($lang = null);

    protected function getAdditionalLinkAttributes() {
        return [];
    }

    abstract function getName($lang);

    public function link($icon = 16, $lang = null, $text = null, $anchor = null) {
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

        $attributes = [
            'test' => 1,
            'class' => 'item-link' . ($displayIcon ? ' item-link-'.$icon : ''),
            'href' => $this->getUrl($lang).$anchor,
            'hreflang' => $lang,
        ] + $this->getAdditionalLinkAttributes();

        $openTag = '<a '.HTML::attributes($attributes).'>';
        $closeTag = '</a>';

        $icon = $displayIcon ? $this->getIcon($icon) : '';
        $text = "<span class=\"item-link-text\">$text</span>";

        return $openTag.$icon.$text.$closeTag;
    }
}
