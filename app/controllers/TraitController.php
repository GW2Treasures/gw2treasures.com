<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class TraitController extends BaseController {
	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details($language, Traits $trait) {
		$this->layout->title = $trait->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make('traits.details')
			->with(compact('trait'));
	}
	
	public function json($language, Traits $trait) {
		return Response::json($trait->getData());
	}

	public function random($language) {
		$id = Traits::random()->first()->id;

		return Redirect::route('trait.details', [$language, $id]);
	}

	public function tooltip($language, Traits $trait) {
		return View::make('traits.tooltip')->with(compact('trait'));
	}

	public function overview($language) {
		$traits = Traits::orderBy('specialization_id', 'ASC')->orderBy('tier', 'ASC')->orderBy('order', 'ASC')->get();

		$this->layout->title = trans('trait.breadcrumb');
		$this->layout->content = View::make('traits.overview')
			->with(compact('traits'));
	}
}
