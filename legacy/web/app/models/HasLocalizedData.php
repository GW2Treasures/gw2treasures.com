<?php

trait HasLocalizedData {
    use HasData;

    private $_localizedDataCache = [];

    public function getData($lang = null) {
        if(is_null($lang)) {
            $lang = App::getLocale();
        }

        // check if we already have decoded data in cache
        if(!array_key_exists($lang, $this->_localizedDataCache)) {
            if(!isset($this->{'data_'.$lang})) {
                return new stdClass();
            }

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
