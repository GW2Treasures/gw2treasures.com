<?php

class AchievementController extends BaseController {
	/** @var \Illuminate\View\View|stdClass $layout */
	protected $layout = 'layout';

	public function details( $language, Achievement $achievement ) {
		$this->layout->title = $achievement->getName();
		$this->layout->fullWidth = true;
		$this->layout->content = View::make( 'achievement.details' )
			->with(compact('achievement'));
	}

	public function json( $language, Achievement $achievement ) {
		return Response::json( $achievement->getData() );
	}

	public function overview( $language ) {
		$categories = Cache::remember('achievement.categories', 60 * 24, function() {
			return AchievementCategory::with('achievements')->with('achievements.category')->get();
		});
		$this->layout->title = trans( 'achievement.overview' );
		$this->layout->content = View::make( 'achievement.overview' )->with(compact('categories'));
	}
}
