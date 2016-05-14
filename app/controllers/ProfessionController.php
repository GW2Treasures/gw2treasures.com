<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class ProfessionController extends BaseController {
	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details($language, Profession $profession) {
		$this->layout->title = $profession->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make('profession.details')
			->with(compact('profession'));
	}

	public function json($language, Profession $profession) {
		return Response::json($profession->getData());
	}

	public function random($language) {
		$id = Profession::random()->first()->id;

		return Redirect::route('profession.details', [$language, $id]);
	}

	public function overview($language) {
		$professions = Profession::all();

		$this->layout->title = trans('profession.breadcrumb');
		$this->layout->content = View::make('profession.overview')
			->with(compact('professions'));
	}
}
