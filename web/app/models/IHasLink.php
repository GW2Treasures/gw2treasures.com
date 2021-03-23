<?php

interface IHasLink {
    public function getUrl($lang = null);

    public function getAdditionalLinkAttributes(array $defaults = []);

    public function getDefaultLinkAttributes($icon, $lang, $href, $displayIcon);

    public function link($icon = 16, $lang = null, $text = null, $anchor = null, $extraAttributes = []);
}
