<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class CurrencyController extends BaseController {
	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details($language, Currency $currency) {
		$this->layout->title = $currency->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make('currency.details')
			->with(compact('currency'));
	}
	
	public function json($language, Currency $currency) {
		return Response::json($currency->getData());
	}

	public function random($language) {
		$id = Currency::random()->first()->id;

		return Redirect::route('currency.details', [$language, $id]);
	}


	public function overview($language) {
        $data = Cache::remember('currency.overview', 60, function() {
            return [
                'currencies' => Currency::get()->sortBy('order')->groupBy(function($c) { return floor($c->order / 100); })
            ];
        });

		$this->layout->title = trans('currency.breadcrumb');
		$this->layout->content = View::make('currency.overview')
			->with($data);
	}
}
