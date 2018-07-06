<?php

abstract class SearchQueryFilter {
    private $value;

    public function getValue() {
        return $this->value;
    }

    public function setValue($value) {
        $this->value = $value;
    }

    protected function getLabel($name) {
        $translator = app('translator');
        $key = 'search.filters.'.$name;

        if($translator->has($key)) {
            return $translator->get($key);
        }

        return ucfirst($name);
    }

    public function render() {
        return 'unknown filter '.get_class($this);
    }

    public function match($term) {
        $value = $this->getValueFromTerm($term);

        if($value !== false) {
            $this->setValue($value);
            return true;
        }

        return false;
    }

    protected abstract function getValueFromTerm($term);

    /**
     * @param \Illuminate\Database\Query\Builder $query
     * @return \Illuminate\Database\Query\Builder
     */
    public function query($query) {
        return $query;
    }

    public abstract function getSearchterm();
}
