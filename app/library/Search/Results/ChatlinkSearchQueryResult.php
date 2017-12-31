<?php

use GW2Treasures\GW2Tools\Chatlinks\Chatlink;

class ChatlinkSearchQueryResult extends SearchQueryResult {
    public function getResults() {
        $chatlinks = [];

        foreach($this->query->searchTerms as $searchTerm) {
            try {
                $chatlink = Chatlink::decode($searchTerm);
            } catch (Exception $e) {
                $chatlink = false;
            }

            if($chatlink !== false) {
                $chatlinks[] = $chatlink;
            }
        }

        return $chatlinks;
    }

    public function getCount() {
        return count($this->getResults());
    }

    public function getResultArray($count) {
        return array_slice($this->getResults(), 0, 10);
    }


    public function hasResults() {
        return $this->getCount() > 0;
    }

    public function render($data) {
        return View::make('search.result.chatlink', $data)->with('result', $this);
    }

    public function renderEmpty($data) {
        return View::make('search.result.chatlink.empty', $data)->with('result', $this);
    }
}
