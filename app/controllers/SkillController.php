<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class SkillController extends BaseController {
	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details($language, Skill $skill) {
		$this->layout->title = $skill->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make('skill.details')
			->with(compact('skill'));
	}
	
	public function json($language, Skill $skill) {
		return Response::json($skill->getData());
	}

	public function random($language) {
		$id = Skill::random()->first()->id;

		return Redirect::route('skill.details', [$language, $id]);
	}

	public function tooltip($language, Skill $skill) {
		return View::make('skill.tooltip')->with(compact('skill'));
	}

	public function overview($language) {
		$skills = Skill::all();

		$this->layout->title = trans('skill.breadcrumb');
		$this->layout->content = View::make('skill.overview')
			->with(compact('skills'));
	}
}
