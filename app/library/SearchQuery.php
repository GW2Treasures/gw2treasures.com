<?php

class SearchQuery {
    /** @var string */
    public $searchTerm;

    /** @var string[] */
    public $searchTerms;

    public static $types = [
        'item', 'chatlink', 'achievement', 'trait', 'specialization', 'skill', 'profession', 'world'
    ];

    protected static $classMap = [
        'item' => ItemSearchQueryResult::class,
        'chatlink' => ChatlinkSearchQueryResult::class,
        'achievement' => AchievementSearchQueryResult::class,
        'trait' => TraitSearchQueryResult::class,
        'specialization' => SpecializationSearchQueryResult::class,
        'profession' => ProfessionSearchQueryResult::class,
        'skill' => SkillSearchQueryResult::class,
        'world' => WorldSearchQueryResult::class,
    ];

    public function __construct($searchTerm) {
        $this->searchTerm = $searchTerm;
        $this->searchTerms = $this->splitSearchTerms();
    }

    /**
     * @param array $data
     * @return \Illuminate\View\View
     */
    public function renderResults($data = []) {
        return View::make('search.index')->with($data)->with('query', $this)->with('results', $this->getResults());
    }

    public function getResults() {
        if(!isset($this->results)) {
            $this->results = [];

            foreach(self::$types as $type) {
                if(array_key_exists($type, self::$classMap)) {
                    $this->results[$type] = new self::$classMap[$type]($this);
                } else {
                    $this->results[$type] = new EmptySearchQueryResult($this);
                }
            }
        }

        return $this->results;
    }
    
    protected function splitSearchTerms() {
        $searchTerms = [];

        preg_match_all('/"(?:\\\\.|[^\\\\"])*"|\S+/', $this->searchTerm, $matches);

        foreach($matches[0] as $searchTerm) {
            if($searchTerm[0] == '"') {
                $searchTerm = substr($searchTerm, 1, -1);
            }

            $searchTerms[] = str_replace(['\\\\', '\\"'], ['\\', '"'], strtolower($searchTerm));
        }

        return array_unique($searchTerms);
    }
}
