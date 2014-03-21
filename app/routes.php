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
Route::filter( 'setLocaleDev', function( $route, $request ) {
	if (Session::has( 'language' ) && in_array( Session::get( 'language'), array( 'de', 'en', 'es', 'fr' )) ) {
		$lang = Session::get( 'language');
	} else {
		// get the prefered language for the visitor
		$lang = Helper::prefered_language( array('en', 'de', 'es', 'fr') );

		// show a notification that we changed the language
		Notification::Add( 'language', Lang::get( 'notifications.autoLanguage', array('language' => Lang::get( 'notifications.language.' . $lang )) ) );
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
Route::get( 'notification/hide/{notification}', array('as' => 'hideNotification', function( $notification ) {
	Notification::Remove( $notification );
	return Redirect::to( Input::get( 'return', '/' ) );
}));

// redirect all requests without language sub domain
Route::group( array('domain' => Config::get('app.domain'), 'before' => 'setLocale'), function() {
	Route::any('{x}', function() {})->where('x', '.*');
});

Route::group( array(
		'domain' => 'dev.' . Config::get('app.domain'),
		'before' => 'setLocaleDev'
	), function() {
		Route::get('/', array(
			'as' => 'dev', function() {
			return View::make( 'dev' )
				->nest( 'content', 'dev.overview' )
				->with( 'title', 'Overview' );
		}));

		Route::get('doc/icons', array(
			'as' => 'dev.icons', function() {
			return View::make( 'dev' )
				->nest( 'content', 'dev.icons' )
				->with( 'title', 'Icons' );
		}));

		Route::get('doc/embedWorldStats', array(
			'as' => 'dev.embedWorldStats', function() {
			return View::make( 'dev' )
				->nest( 'content', 'dev.embedWorldStats' )
				->with( 'title', 'Embedding WvW World Stats' );
		}));
	}
);

// all main routes
Route::group( array(
		'domain' => '{language}.' . Config::get('app.domain'),
		'before' => 'setLocale',
		'after' => ''
	), function() {
	
		// mainpage
		Route::get('/', function() {
			return View::make( 'layout' )
				->nest( 'content', 'start' )
				->with( 'title', 'Welcome!' );
		});
		
		//================================
		// Items
		//================================
	
		// bind the {item} parameter in routes to the Item model
		Route::bind( 'item', function( $id, $route ) {
			$item = Item::find( $id );
			if( is_null( $item )) {
				throw new ItemNotFoundException( $id );
			}
			return $item;
		});
		
		// random item
		Route::get('item/random', array(
			'as' => 'randomitem',
			'uses' => 'ItemController@random'
		));

		// item details
		Route::get('item/{item}', array( 
			'as' => 'itemdetails', 
			'uses' => 'ItemController@showDetails'
		));

		// item tooltip
		Route::get('item/{item}/tooltip', array(
			'as' => 'itemtooltip',
			'uses' => 'ItemController@tooltip'
		));

		// json
		Route::get('item/{item}/json', array(
			'as' => 'itemJSON',
			'uses' => 'ItemController@json'
		));

		// search
		Route::get('search', array(
			'as' => 'search', 
			'uses' => 'ItemController@search'
		));

		Route::get('search/autocomplete', array(
			'as' => 'search.autocomplete',
			'uses' => 'ItemController@searchAutocomplete'
		));

		//================================
		// WVW
		//================================

		// bind the {item} parameter in routes to the Item model
		Route::model( 'world', 'World');

		// overview
		Route::get('wvw', array(
			'as' => 'wvw',
			'uses' => 'WvWController@overview'
		));

		// world info embedded
		Route::get('wvw/world/{world}/embedded', array(
			'as' => 'wvw.world.embedded',
			'uses' => 'WvWController@worldEmbedded'
		));

		// world info
		Route::get('wvw/world/{world}', array(
			'as' => 'wvw.world',
			'uses' => 'WvWController@world'
		));

		//================================
		// STUFF
		//================================

		// contact
		Route::get('contact', array(
			'as' => 'contact',
			function() {
				return View::make( 'layout' )
					->nest( 'content', 'contact' )
					->with( 'title', 'Contact' );
			}
		));
	}
);
