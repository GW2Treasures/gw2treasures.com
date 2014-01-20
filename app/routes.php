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

// handle localizations 
Route::filter( 'setLocale', function( $route, $request ) {
	$parameters = $route->parameters();
	$lang = array_key_exists( 'language', $parameters ) ? $parameters[ 'language' ] : '';

	// handle invalid languages
	if( !in_array( $lang, array( 'de', 'en', 'es', 'fr' )) ) {

		// check if we have a valid language in the session
		if (Session::has( 'language' ) && in_array( Session::get( 'language'), array( 'de', 'en', 'es', 'fr' )) ) {
			$lang = Session::get( 'language');
		} else {
			// get the prefered language for the visitor
			$lang = Helper::prefered_language( array('en', 'de', 'es', 'fr') );

			// show a notification that we changed the language
			Notification::Add( 'language', Lang::get( 'notifications.autoLanguage', array('language' => Lang::get( 'notifications.language.' . $lang )) ) );
		}

		// redirect to the right subdomain
		return Redirect::to( '//' . $lang . '.' . Config::get('app.domain') .  $request->getRequestUri() );
	}

	// set locale
	App::setLocale( $lang );

	// handle changed language
	if( Session::has( 'language' ) && Session::get( 'language') != $lang ) {
		// hide the autodetected language notification if its there
		Notification::Remove( 'language' );
	}

	// save the language in the session
	Session::put( 'language', $lang );
});

// route to hide notifications
Route::get('notification/hide/{key}', array('as' => 'hideNotification', function( $key ) {
	Notification::Remove( $key );
	return Redirect::back();
}));

// redirect all requests without language sub domain
Route::group( array('domain' => Config::get('app.domain'), 'before' => 'setLocale'), function() {
	Route::any('{x}', function() {})->where('x', '.*');
});

// all main routes
Route::group( array(
		'domain' => '{language}.' . Config::get('app.domain'),
		'before' => 'setLocale',
		'after' => ''
	), function() {
	
		// bind the {item} parameter in routes to the Item model
		Route::model('item', 'Item', function( ) {
			throw new Exception( 'Item not found' );
		});

		// mainpage
		Route::get('/', function() {
			return View::make( 'layout' )
				->nest( 'content', 'start' )
				->with( 'title', 'Welcome!' );
		});
		
		// item details
		Route::get('item/{item}', array( 
			'as' => 'itemdetails', 
			'uses' => 'ItemController@showDetails'
		));

		// search
		Route::get('search', array('as' => 'search', function() {
			return 'search';
		}));
	}
);