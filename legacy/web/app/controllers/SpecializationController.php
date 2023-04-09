<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class SpecializationController extends BaseController {
	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details($language, Specialization $specialization) {
		$this->layout->title = $specialization->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make('specialization.details')
			->with(compact('specialization'));
	}


	public function json($language, Specialization $specialization) {
		return Response::json($specialization->getData());
	}

	public function random($language) {
		$id = Specialization::random()->first()->id;

		return Redirect::route('specialization.details', [$language, $id]);
	}


	public function overview($language) {
		$specializationsByProfession = Specialization::orderBy('profession_id', 'ASC')->get()->groupBy('profession_id');

		$this->layout->title = 'Specializations'; // TODO!
		$this->layout->content = View::make('specialization.overview')
			->with(compact('specializationsByProfession'));
	}
}
