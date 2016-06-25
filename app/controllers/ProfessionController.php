<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class ProfessionController extends BaseController {
	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details($language, Profession $profession) {
		$this->layout->title = $profession->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make('profession.details')
			->with($this->getProfessionData($profession));
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

	protected function getProfessionData(Profession $profession) {
		$weapons = new Collection((array)$profession->getData()->weapons);

        $ids = [];
        foreach($weapons as $weapon) {
            foreach($weapon->skills as $skill) {
                $ids[] = $skill->id;
            }
        };

        $skills = Skill::whereIn('id', $ids)->remember(60)->get()->getDictionary();

		$weapons->map(function($weapon, $name) use ($skills) {
            $weapon->is2Handed = $this->is2Handed($name);
			$weapon->skills = (new Collection($weapon->skills))->each(function($skill) {
                $skill->slot = $this->mapSlotToIndex($skill->slot);
                $skill->requirement = $this->requirement($skill);
			})->groupBy('requirement')->map(function($group) use ($skills) {
                return (new Collection($group))->keyBy('slot')->each(function($skill) use ($skills) {
                    $skill->skill = isset($skills[$skill->id]) ? $skills[$skill->id] : null;
                });
            });

            return $weapon;
		});

		return compact('profession', 'weapons');
	}

	protected function mapSlotToIndex($slot) {
		return [
			'Weapon_1' => 0,
			'Weapon_2' => 1,
			'Weapon_3' => 2,
			'Weapon_4' => 3,
			'Weapon_5' => 4,
		][$slot];
	}

    protected function requirement($skill) {
        if (isset($skill->offhand)) {
            return 'offhand.'.$skill->offhand;
        }
        if (isset($skill->attunement)) {
            return 'attunement.'.$skill->attunement;
        }

        return '';
    }

    protected function is2Handed($weapon) {
        return !in_array($weapon, [
            'Axe', 'Dagger', 'Mace', 'Pistol', 'Sword', 'Scepter', 'Focus', 'Shield', 'Torch', 'Warhorn'
        ]);
    }
}
