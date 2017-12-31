<?php

class StringSearchQueryFilter extends SearchQueryFilter {
    protected $name;
    protected $value;

    public function __construct($name) {
        $this->name = $name;
    }

    public function getName() {
        return $this->name;
    }

    public function getSearchterm() {
        if($this->getValue()) {
            return $this->getName().':'.$this->getValue();
        }

        return false;
    }

    protected function getValueFromTerm($term) {
        $regex = '/^'.preg_quote($this->getName()).':(?<value>.*)$/';

        if(preg_match($regex, $term, $match)) {
            return $match['value'];
        }

        return false;
    }


    public function render() {
        return Form::label($this->getHtmlId(), $this->getName()) . Form::text($this->getHtmlId(), $this->getValue());
    }

    public function query($query) {
        if($this->getValue()) {
            return $query->where($this->getName(), '=', $this->getValue());
        }

        return $query;
    }

    protected function getHtmlId() {
        return 'filter['.$this->getName().']';
    }
}
