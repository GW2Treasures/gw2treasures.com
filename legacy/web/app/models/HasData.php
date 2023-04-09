<?php

trait HasData {
    private $_dataCache = null;

    public function getData() {
        // check if we already have decoded data in cache
        if(is_null($this->_dataCache)) {
            if(!isset($this->data)) {
                return new stdClass();
            }

            // get normalized json data
            $json = $this->normalizeRawData($this->data);

            // decode data and add to cache
            $this->_dataCache = json_decode($json);
        }

        // return cached data
        return $this->_dataCache;
    }

    protected function normalizeRawData($data) {
        return str_replace(['<br>'], ['\n'], $data);
    }
}
