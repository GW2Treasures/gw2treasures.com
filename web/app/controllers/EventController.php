<?php

use Carbon\Carbon;
use GW2Treasures\GW2Api\GW2Api;
use Illuminate\Support\Arr;

class EventController extends BaseController {
	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details($language, Event $event) {
		$this->layout->title = $event->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make('event.details')
			->with(compact('event'));
	}
	
	public function json($language, Event $event) {
		return Response::json($event->getData());
	}

	public function random($language) {
		$id = Event::random()->first()->id;

		return Redirect::route('event.details', [$language, $id]);
	}

	public function overview($language) {
		$events = Event::all();

		$this->layout->title = trans('event.breadcrumb');
		$this->layout->content = View::make('event.overview')
			->with(compact('events'));
	}
}
