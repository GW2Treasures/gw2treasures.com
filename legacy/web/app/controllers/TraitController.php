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
	    $data = Cache::remember('trait.overview', 60, function() {
            return [
                'traitCount' => Traits::count(),
                'traitMinorCount' => Traits::whereSlot('Minor')->count(),
                'traitMajorCount' => Traits::whereSlot('Major')->count(),
                'professions' => Profession::all()
            ];
        });

		$this->layout->title = trans('trait.breadcrumb');
		$this->layout->fullWidth = true;
		$this->layout->content = View::make('traits.overview')
			->with($data);
	}

    public function byProfession($language, Profession $profession) {
        $specializations = $profession->specializations()->with('traits')->remember(60)->get();

        $this->layout->title = trans('trait.breadcrumb');
        $this->layout->content = View::make('traits.byProfession')
            ->with(compact('profession', 'specializations'));
    }
}
