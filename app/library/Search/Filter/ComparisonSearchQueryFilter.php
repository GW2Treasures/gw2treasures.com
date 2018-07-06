<?php

class ComparisonSearchQueryFilter extends SearchQueryFilter {
    static $operators = ['<', '>', '='];
    protected $name;
    protected $columnName;
    protected $value;
    private $min;
    private $max;
    private $multiplier;

    public function __construct($name, $min = 0, $max = null, $multiplier = 1) {
        $this->name = $name;
        $this->columnName = $name;
        $this->min = $min;
        $this->max = $max;
        $this->multiplier = $multiplier;
    }

    public function getName() {
        return $this->name;
    }

    public function getSearchterm() {
        if($this->getValue()) {
            list($operator, $value) = $this->getValue();

            if($value === '') {
                return false;
            }

            if($this->min) {
                $value = max($this->min, $value);
            }

            if($this->max) {
                $value = min($this->max, $value);
            }

            return $this->getName().':'.($operator === '=' ? '' : $operator).$value;
        }

        return false;
    }

    protected function getValueFromTerm($term) {
        $regex = '/^'.preg_quote($this->getName()).':(?<operator>['.implode(self::$operators).']?)(?<value>.*)$/';

        if(preg_match($regex, $term, $match)) {
            $operator = $match['operator'];
            $value = $match['value'];

            if(!$value) {
                return false;
            }

            $value = intval($value);

            if($this->min) {
                $value = max($this->min, $value);
            }

            if($this->max) {
                $value = min($this->max, $value);
            }

            return [$operator ? $operator : '=', $value];
        }

        return false;
    }

    public function render() {
        list($operator, $value) = $this->getValue();

        $operators = array_combine(static::$operators, static::$operators);

        return Form::label($this->getHtmlId(), $this->getLabel($this->getName())) . '<div class="filter--comparison">' .
            Form::select($this->getHtmlId().'[0]', $operators, $operator) .
            Form::number($this->getHtmlId().'[1]', $value, ['min' => $this->min, 'max' => $this->max]) . '</div>';
    }

    public function query($query) {
        if($this->getValue()) {
            list($operator, $value) = $this->getValue();

            return $query->where($this->columnName, $operator, $value / $this->multiplier);
        }

        return $query;
    }

    protected function getHtmlId() {
        return 'filter['.$this->getName().']';
    }

    public function column($column) {
        $this->columnName = $column;

        return $this;
    }
}
