<?php

class BooleanSearchQueryFilter extends SearchQueryFilter {
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
            return $this->getValue().':'.$this->getName();
        }

        return false;
    }

    protected function getValueFromTerm($term) {
        $regex = '/^(?<value>is|not):'.preg_quote($this->getName()).'$/';

        if(preg_match($regex, $term, $match)) {
            return $match['value'];
        }

        return false;
    }

    protected function mapValueToBoolean() {
        return $this->value === 'is';
    }

    public function render() {
        return Form::label($this->getHtmlId(), $this->getName()) . Form::select($this->getHtmlId(), ['', 'is' => 'Yes', 'not' => 'No'], $this->getValue());
    }

    public function query($query) {
        if($this->getValue()) {
            return $query->where($this->getName(), '=', $this->mapValueToBoolean() ? 1 : 0);
        }

        return $query;
    }

    protected function getHtmlId() {
        return 'filter['.$this->getName().']';
    }
}
