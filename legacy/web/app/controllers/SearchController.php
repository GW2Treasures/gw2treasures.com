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

    public function api() {
        $language = Input::get('l', 'en');

        if(!in_array($language, ['de', 'en', 'es', 'fr'])) {
            $language = 'en';
        }

        $searchTerm = $this->getSearchTerm();

        $searchQuery = new SearchQuery($searchTerm);
        $results = $searchQuery->getResults();

        $response = [];

        foreach($results as $key => $result) {
            $response[$key] = (object)[
                'count' => $result->getCount(),
                'results' => Helper::collect($result->getResultArray(5))->map(function($entry) use ($language) {
                    $out = [];
                    if($entry instanceof BaseModel) {
                        $out['id'] = $entry->id;
                        $out['name'] = $entry->getName($language);

                        if($entry instanceof IHasIcon) {
                            $out['icon'] = [
                                16 => $entry->getIconUrl(16),
                                32 => $entry->getIconUrl(32),
                                64 => $entry->getIconUrl(64),
                            ];
                        }

                        if($entry instanceof IHasLink) {
                            $out['link'] = [
                                'url' => $entry->getUrl($language),
                                'attributes' => $entry->getAdditionalLinkAttributes(
                                    $entry->getDefaultLinkAttributes(16, $language, $entry->getUrl($language), true)
                                )
                            ];
                        }
                    } else {
                        $out = $entry;
                    }

                    return $out;
                })
            ];
        }

        return Response::json($response)
            ->setPublic()
            ->setMaxAge(60)
            ->header('content-language', $language)
            ->header('Access-Control-Allow-Origin', Request::header('Origin'));
    }

    /**
     * @return string
     */
    protected function getSearchTerm() {
        return trim(Input::get('q'));
    }
}
