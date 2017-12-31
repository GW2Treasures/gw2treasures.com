<?php

class RangeSearchQueryFilter extends IntegerSearchQueryFilter {
    protected $name;
    protected $value;

    public function __construct($name) {
        $this->name = $name;
    }

    public function getName() {
        return $this->name;
    }

    public function getSearchterm() {
        $value = $this->getValue();

        if($value && count($value) === 2 && $value[0] !== '' && $value[1] !== '') {
            return $this->getName().':'.($value[0] === $value[1] ? $value[0] : implode('-', $value));
        }

        return false;
    }

    protected function getValueFromTerm($term) {
        $regex = '/^'.preg_quote($this->getName()).':(?<min>[^-]+)(-(?<max>.+))?$/';

        if(preg_match($regex, $term, $match)) {
            return isset($match['max'])
                ? [$match['min'], $match['max']]
                : [$match['min'], $match['min']];
        }

        return false;
    }

    public function render() {
        return Form::label($this->getHtmlId(), $this->getName()).'<div class="filter--range">'.
            Form::number($this->getHtmlId().'[0]', $this->getValue()[0]).'<span class="filter--range__sep"> - </span>'.
            Form::number($this->getHtmlId().'[1]', $this->getValue()[1]).'</div>';
    }

    public function query($query) {
        if($this->getValue()) {
            return $query->whereBetween($this->getName(), $this->getValue());
        }

        return $query;
    }

    protected function getHtmlId() {
        return 'filter['.$this->getName().']';
    }
}
