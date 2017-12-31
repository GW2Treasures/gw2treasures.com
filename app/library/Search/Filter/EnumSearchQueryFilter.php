<?php

class EnumSearchQueryFilter extends StringSearchQueryFilter {
    protected $values;

    public function __construct($name, $values) {
        parent::__construct($name);

        $this->values = ['' => ''] + $values;
    }

    protected function getValueFromTerm($term) {
        $value = parent::getValueFromTerm($term);

        if($value !== false) {
            foreach(array_keys($this->values) as $valid) {
                if(strtolower($value) === strtolower($valid)) {
                    return $valid;
                }
            }
        }

        return $value;
    }

    public function render() {
        $values = $this->values;

        if(!array_key_exists($this->getValue(), $values)) {
            $values = [$this->getValue() => '['.$this->getValue().']'] + $values;
        }

        return Form::label($this->getHtmlId(), $this->getName()) .
            Form::select($this->getHtmlId(), $values, $this->getValue());
    }
}
