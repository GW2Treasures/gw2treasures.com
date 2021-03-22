<?php

trait HasIcon {
    public abstract function getIconUrl($size = 64);

    protected function getInternalIconUrl($size = 64, $signature, $file_id) {
        $size = $this->getIconSize($size);

        return "https://icons-gw2.darthmaim-cdn.de/${signature}/${file_id}-${size}px.png";
    }

    protected function getIconSize($size = 64) {
        if(!is_int($size)) {
            return 64;
        }

        if($size <= 16) {
            return 16;
        } elseif($size <= 32) {
            return 32;
        } else {
            return 64;
        }
    }

    public function getIcon($size = 64) {
        $attributes = [
            'src' => $this->getIconUrl($size),
            'width' => $size,
            'height' => $size,
            'alt' => '',
            'crossorigin' => 'anonymous'
        ];

        if($size <= 32) {
            $attributes['srcset'] = $this->getIconUrl($size*2).' 2x';
        }

        return '<img '.HTML::attributes($attributes).'>';
    }
}
