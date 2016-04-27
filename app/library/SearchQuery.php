<?php

use GW2Treasures\GW2Tools\Chatlinks\Chatlink;
use GW2Treasures\GW2Tools\Chatlinks\ItemChatlink;
use GW2Treasures\GW2Tools\Chatlinks\RecipeChatlink;
use Illuminate\Database\Query\Builder;

class SearchQuery {
    public $searchTerm;

    /** @var \Illuminate\Pagination\Paginator */
    protected $results;

    /** @var Chatlink[] $chatlinks */
    protected $chatlinks = [];

    protected $query;

    public function __construct($searchTerm) {
        $this->searchTerm = $searchTerm;
    }

    /**
     * @return Builder
     */
    public function getQuery() {
        if(isset($this->query)) {
            return $this->query;
        }

        // search terms
        $query = Item::where(function($query) {
            foreach($this->splitSearchTerms() as $searchTerm) {
                $searchTerm = trim($searchTerm, '"');
                $query = $query->where(function($query) use($searchTerm) {
                    $query = $this->queryOrWhereStringContains($query, 'name_de', $searchTerm);
                    $query = $this->queryOrWhereStringContains($query, 'name_en', $searchTerm);
                    $query = $this->queryOrWhereStringContains($query, 'name_es', $searchTerm);
                    $query = $this->queryOrWhereStringContains($query, 'name_fr', $searchTerm);

                    return $query;
                });
            }
            return $query;
        });

        $additionalItems = [];
        foreach($this->splitSearchTerms() as $searchTerm) {
            try {
                $chatlink = Chatlink::decode($searchTerm);
            } catch (Exception $e) {
                $chatlink = false;
            }

            if($chatlink !== false) {
                $this->chatlinks[] = $chatlink;
            }

            if($chatlink instanceof ItemChatlink) {
                $itemStack = $chatlink->getItemStack();
                $additionalItems[] = $itemStack->id;
                foreach($itemStack->upgrades as $upgrade) {
                    $additionalItems[] = $upgrade;
                }
            } elseif($chatlink instanceof RecipeChatlink) {
                $additionalItems[] = Recipe::remember(3)->find($chatlink->getId())->output_id;
            }
        }

        $query->orWhereIn('id', $additionalItems);

        $query->orderBy('views', 'desc');

        $this->query = $query->remember(3);

        return $this->query;
    }

    public function getResults() {
        if(!isset($this->results)) {
            return $this->results = $this->getQuery()->paginate(50)->appends(
                Input::only(['q'])
            );
        }

        return $this->results;
    }

    public function getChatlinks() {
        $this->getQuery();

        return $this->chatlinks;
    }

    public function hasResults() {
        return $this->getResults()->getTotal() > 0;
    }

    public function hasChatlinks() {
        return !empty($this->getChatlinks());
    }

    public function renderResults($data = []) {
        return View::make('item.search.index')->with($data)->with('query', $this);
    }

    protected function splitSearchTerms() {
        preg_match_all('/"(?:\\\\.|[^\\\\"])*"|\S+/', $this->searchTerm, $matches);
        return $matches[0];
    }

    /**
     * @param Builder $query
     * @param string  $column
     * @param string  $value
     * @param string  $boolean
     * @return Builder
     */
    protected function queryWhereStringContains($query, $column, $value, $boolean = 'and') {
        // custom escape character (backslashes get really weird with with quadruple escapes…)
        $e = '=';

        // escape the escape char and wildcards
        $replacements = [
            $e  => $e.$e,
            '%' => $e.'%',
            '_' => $e.'_'
        ];
        $value = '%'.strtoupper(strtr( $value, $replacements )).'%';

        // run the query
        return $query->whereRaw("UPPER(`$column`) LIKE ? ESCAPE '$e'", [$value], $boolean);
    }

    /**
     * @param Builder $query
     * @param string  $column
     * @param string  $value
     * @return Builder
     */
    protected function queryOrWhereStringContains($query, $column, $value) {
        return $this->queryWhereStringContains($query, $column, $value, 'or');
    }
}
