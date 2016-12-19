<?php

interface IHasLink {
    public function getUrl($lang = null);

    public function link($icon = 16, $lang = null, $text = null, $anchor = null, $extraAttributes = []);
}
