<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

// filter to set locale depending on subdomain
// redirect to best fitting subdomain if subdomain doesnt exist / is invalid
Route::filter( 'setLocale', function( $route, $request ) {
	$parameters = $route->parameters();
	$lang = array_key_exists( 'language', $parameters ) ? $parameters[ 'language' ] : '';
	if( !in_array( $lang, array( 'de', 'en', 'es', 'fr' )) ) {
		$lang = Helper::prefered_language( array('de', 'en', 'es', 'fr') );
		return Redirect::to( '//' . $lang . '.' . Config::get('app.domain') .  $request->getRequestUri() );
	}
	App::setLocale( $parameters['language'] );
});

//redirect all requests without language sub domain
Route::group( array('domain' => Config::get('app.domain'), 'before' => 'setLocale'), function() {
	Route::any('{x}', function() {})->where('x', '.*');
});

Route::group( array('domain' => '{language}.' . Config::get('app.domain'), 'before' => 'setLocale'), function() {
	Route::model('item', 'Item', function( ) {
		throw new Exception( 'Item not found' );
	});

	Route::get('/', function() {
		return View::make('start');
	});
	
	Route::get('item/{item}', array( 'as' => 'itemdetails', 'uses' => 'ItemController@showDetails') );

	Route::get('search', array('as' => 'search', function() {
		return 'search';
	}));
});