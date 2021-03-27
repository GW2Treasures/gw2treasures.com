<?php

class MapController extends BaseController {
    /** @var Illuminate\View\View|stdClass $layout */
    protected $layout = 'layout';

    public function index( $language ) {
        $this->layout->title = 'Map';
        $this->layout->content = View::make('map.index');
        $this->layout->fullWidth = true;
    }
}
