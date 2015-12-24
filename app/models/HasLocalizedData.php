<?php

trait HasLocalizedData {
    use HasData;

    private $_localizedDataCache = [];

    public function getData($lang = null) {
        // check if we already have decoded data in cache
        if(!array_key_exists($lang, $this->_localizedDataCache)) {
            // get localized and normalized json data
            $json = $this->normalizeRawData($this->localized('data', $lang));

            // decode data and add to cache
            $this->_localizedDataCache[$lang] = json_decode($json);
        }

        // return cached data
        return $this->_localizedDataCache[$lang];
    }

    abstract function localized($property, $lang = null);
}
