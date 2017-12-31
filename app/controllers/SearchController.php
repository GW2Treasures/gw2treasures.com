<?php

use GW2Treasures\GW2Tools\Chatlinks\Chatlink;
use GW2Treasures\GW2Tools\Chatlinks\SkinChatlink;

class SearchController extends BaseController {
    /** @var \Illuminate\View\View|stdClass $layout  */
    protected $layout = 'layout';

    public function search($language) {
        $searchTerm = $this->getSearchTerm();

        if($searchTerm == '') {
            return Redirect::route('search.results', [$language, SearchQuery::$types[0]]);
        }

        $query = new SearchQuery($searchTerm);

        /** @var SearchQueryResult $result */
        foreach($query->getResults() as $type => $result) {
            if($result->hasResults()) {
                return Redirect::route('search.results', [$language, $type, 'q' => $searchTerm]);
            }
        }
        
        return Redirect::route('search.results', [$language, SearchQuery::$types[0], 'q' => $searchTerm]);
    }

    public function results($language, $type) {
        $searchTerm = $this->getSearchTerm();

        $query = new SearchQuery($searchTerm);

        $this->layout->content = $query->renderResults()->with('type', $type);
        $this->layout->fullWidth = true;
        $this->layout->title = 'Search Results'; // TODO
    }

    public function filter($language, $type) {
        $searchTerm = $this->getSearchTerm();
        $query = new SearchQuery($searchTerm);

        foreach(Input::get('filter') as $name => $filter) {
            $filters = $query->getResults()[$type]->getFilters();
            $filters[$name]->setValue($filter);

            $searchTerm .= ' '.$filters[$name]->getSearchterm();
        }

        return Redirect::route('search.results', [$language, $type, 'q' => $query->getResults()[$type]->getSearchTerm()]);
    }

    public function autocomplete($language) {
        $searchTerm = $this->getSearchTerm();

        $searchQuery = new SearchQuery($searchTerm);
        $items = new ItemSearchQueryResult($searchQuery);

        $response = new stdClass();
        $response->items = [];

        foreach($items->getQuery()->take(10)->get() as $item) {
            if(is_null($item)) {
                continue;
            }
            $response->items[] = [
                'id' => $item->id,
                'name' => $item->getName(),
                'icon16' => $item->getIconUrl(16),
                'icon32' => $item->getIconUrl(32),
                'icon64' => $item->getIconUrl(64)
            ];
        }

        return Response::json($response);
    }

    /**
     * @return string
     */
    protected function getSearchTerm() {
        return trim(Input::get('q'));
    }
}
