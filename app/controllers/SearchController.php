<?php

use GW2Treasures\GW2Tools\Chatlinks\Chatlink;
use GW2Treasures\GW2Tools\Chatlinks\SkinChatlink;

class SearchController extends BaseController {
    /** @var \Illuminate\View\View|stdClass $layout  */
    protected $layout = 'layout';

    public function search($language) {
        $searchTerm = trim(Input::get('q'));

        if(strlen($searchTerm) > 0) {
            // item id
            if(preg_match('/^[0-9]+$/', $searchTerm)) {
                $item = Item::find(intval($searchTerm));
                if(!is_null($item)) {
                    return route('itemdetails', [$language, $searchTerm]);
                }
            }

            try {
                $chatlink = Chatlink::decode($searchTerm);
            } catch (Exception $e) {
                $chatlink = false;
            }

            if($chatlink instanceof SkinChatlink) {
                return Redirect::route('skin.details', [$language, $chatlink->getId()]);
            }
        }

        $query = new SearchQuery($searchTerm);

        $this->layout->content = $query->renderResults();
        $this->layout->fullWidth = true;
        $this->layout->title = 'Search Results';
    }

    public function searchAutocomplete($language) {
        $searchTerm = trim(Input::get('q'));

        $searchQuery = new SearchQuery($searchTerm);

        $response = new stdClass();
        $response->items = [];

        foreach($searchQuery->getQuery()->take(10)->get() as $item) {
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
}
