<?php

abstract class SearchQueryResult {
    protected $query;
    private $terms = [];

    public function __construct(SearchQuery $query) {
        $this->query = $query;

        foreach($query->searchTerms as $term) {
            $matchesAFilter = false;

            foreach($this->getFilters() as $filter) {
                if($filter->match($term)) {
                    $matchesAFilter = true;
                    break;
                }
            }

            if(!$matchesAFilter) {
                $this->terms[] = $term;
            }
        }
    }

    public abstract function getResults();

    public abstract function getResultArray($count);

    public abstract function getCount();

    public function hasResults() {
        return $this->getCount() > 0;
    }

    public abstract function render($data);

    public function renderEmpty($data) {
        return View::make('search.result.empty', $data);
    }

    protected function getInternalFilters() {
        return [];
    }

    public function getSearchTermsWithoutFilters() {
        return $this->terms;
    }

    public function getSearchTermWithoutFilters() {
        return implode(array_map(function($t) {
            return strstr($t, ' ') ? '"'.$t.'"' : $t;
        }, $this->getSearchTermsWithoutFilters()), ' ');
    }
    
    public function getFilterSearchTerms() {
        $terms = [];
        
        foreach($this->getFilters() as $filter) {
            $term = $filter->getSearchterm();
            if($term) {
                $terms[] = $term;
            }
        }

        return $terms;
    }

    public function getFilterSearchTerm() {
        return implode(array_map(function($t) {
            return strstr($t, ' ') ? '"'.$t.'"' : $t;
        }, $this->getFilterSearchTerms()), ' ');
    }

    public function getSearchTerm() {
        return trim($this->getSearchTermWithoutFilters().' '.$this->getFilterSearchTerm());
    }

    private $_filters;

    /**
     * @return SearchQueryFilter[]
     */
    public final function getFilters() {
        if(!isset($this->_filters)) {
            $this->_filters = Cache::remember(
                'search.filters.'.App::getLocale().'.'.get_class($this), 10,
                function() { return $this->getInternalFilters(); }
            );
        }

        return $this->_filters;
    }

    public final function hasFilters() {
        return !empty($this->getFilters());
    }
}
