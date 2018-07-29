<?php

class StringSearchQueryFilter extends SearchQueryFilter {
    protected $name;
    protected $value;
    protected $column;

    public function __construct($name, $column = null) {
        $this->name = $name;
        $this->column = is_null($column) ? $name : $column;
    }

    public function getName() {
        return $this->name;
    }

    public function getColumn() {
        return $this->column;
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
            return $query->where($this->getColumn(), '=', $this->getValue());
        }

        return $query;
    }

    protected function getHtmlId() {
        return 'filter['.$this->getName().']';
    }
}
