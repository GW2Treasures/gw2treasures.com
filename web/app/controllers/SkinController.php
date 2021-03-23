<?php

use Illuminate\Support\Collection;

class SkinController extends BaseController {
	protected $layout = 'layout';

	public function details( $language, Skin $skin ) {
		$this->layout->title = $skin->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make( 'skin.details' )
			->with( 'skin', $skin );
	}

	public function overview( $language ) {
		$types = $this->getTypes();

		$this->layout->title = trans('skin.overview');
		$this->layout->content = View::make('skin.overview')->with(compact('types'));
	}

	public function byType($language, $type, $subtype) {
		$types = $this->getTypes();

		$type = $types->first(function($_, $t) use ($type) {
			return strtolower($t->type) === $type;
		});

		if($type === null) {
			throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException();
		}

		$subtype = $type->subtypes->first(function($_, $st) use ($subtype) {
			return strtolower($st->subtype) === $subtype;
		});

		if($subtype === null) {
			throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException();
		}

		if($subtype === 'Back') {
			$skins = Skin::where('type', '=', 'Back');
		} else {
			$skins = Skin::where('type', '=', $type->type)->where('subtype', '=', $subtype->subtype);
		}

		$skins = $skins->remember(60)->get();

		$this->layout->title = trans('item.type.'.$type->type).' / '.($subtype->subtype !== 'Back' ? trans( 'item.subtype.'.$type->type.'.'.$subtype->subtype ) : trans('item.type.Back'));
		$this->layout->content = View::make('skin.listByType')->with(compact('type', 'subtype', 'skins'));
	}

	/**
	 * @return Collection
	 */
	private function getTypes()
	{
		return Cache::remember('skin.types', 60 * 24, function() {
			return with(new Collection(
				DB::table('skins')->groupBy('type', 'subtype')->select('type', 'subtype', DB::raw('COUNT(*) as count'))->get()
			))->map(function ($type) {
				// include back skins in armor
				if ($type->type === 'Back') {
					$type->type = 'Armor';
					$type->subtype = 'Back';
				}

				return $type;
			})->groupBy('type')->map(function ($subtypes, $type) {
				return (object)[
					'type' => $type,
					'subtypes' => with(new Collection($subtypes))
				];
			});
		});
	}
}
