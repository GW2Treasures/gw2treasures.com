<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class NoveltyController extends BaseController {
	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details($language, Novelty $novelty) {
		$this->layout->title = $novelty->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make('novelty.details')
			->with(compact('novelty'));
	}
	
	public function json($language, Novelty $novelty) {
		return Response::json($novelty->getData());
	}

	public function random($language) {
		$id = Novelty::random()->first()->id;

		return Redirect::route('novelty.details', [$language, $id]);
	}

	public function overview($language) {
        $data = Cache::remember('novelty.overview', 60, function() {
            return [
                'novelties' => Novelty::get()->groupBy('slot')
            ];
        });

		$this->layout->title = trans('novelties.breadcrumb');
		$this->layout->content = View::make('novelty.overview')
			->with($data);
	}
}
