<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class MountController extends BaseController {
	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details($language, MountType $mount) {
		$this->layout->title = $mount->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make('mount.details')
			->with(compact('mount'));
	}

    public function skinDetails($language, MountSkin $skin) {
        $this->layout->title = $skin->getName();
        $this->layout->fullWidth = true;
        $this->layout->content = View::make('mount.skinDetails')
            ->with(compact('skin'));
    }
	
	public function json($language, MountType $mount) {
		return Response::json($mount->getData());
	}

	public function skinJson($language, MountSkin $skin) {
        return Response::json($skin->getData());
    }

	public function random($language) {
		$id = MountType::random()->first()->id;

		return Redirect::route('mount.details', [$language, $id]);
	}

    public function skinRandom($language) {
        $id = MountSkin::random()->first()->id;

        return Redirect::route('mount.skin.details', [$language, $id]);
    }

	public function overview($language) {
        $data = Cache::remember('mount.overview', 60, function() {
            return [
                'mounts' => MountType::with('defaultSkin')->get()
            ];
        });

		$this->layout->title = trans('mount.breadcrumb');
		$this->layout->content = View::make('mount.overview')
			->with($data);
	}
}
