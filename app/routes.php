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
			Notification::Add( 'language', 'notifications.autoLanguage', array(
				'data' => array(
					'language' => Lang::get( 'notifications.language.' . $lang )
			)));
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
	if( isset( $_GET['l'] ) && in_array( $_GET['l'], array( 'de', 'en', 'es', 'fr' )) ) {
		$lang = $_GET['l'];
	} elseif( Session::has( 'language' ) && in_array( Session::get( 'language'), array( 'de', 'en', 'es', 'fr' )) ) {
		$lang = Session::get( 'language');
	} else {
		// get the prefered language for the visitor
		$lang = Helper::prefered_language( array( 'en', 'de', 'es', 'fr' ));

		// show a notification that we changed the language
		Notification::Add( 'language', 'notifications.autoLanguage', array(
			'data' => array(
				'language' => Lang::get( 'notifications.language.' . $lang )
		)));
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

Route::filter( 'acceptCookies', function( $route, $request ) {
	if( !Session::has( 'acceptCookies' )) {
		Session::put( 'acceptCookies', true );
		Notification::Add( 'acceptCookies', 'notifications.cookies' );
	}
});

Route::filter( 'translateAuth', function( $route, $request ) {
	if( !Session::has( 'translate.authenticated' ) || Session::get( 'translate.authenticated' ) !== true ) {
		if( $request->getUser() == 'translate' && $request->getPassword() == Config::get( 'app.translatePassword' )) {
			Session::put( 'translate.authenticated', true );
			return;
		} else {
			$headers = array( 'WWW-Authenticate' => 'Basic' );
			return Response::make( 'Invalid credentials.', 401, $headers );
		}
	}
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


// dev routes
Route::group( array(
		'domain' => 'dev.' . Config::get('app.domain'),
		'before' => 'setLocaleDev|acceptCookies'
	), function() {
		Route::get('/', array(
			'as' => 'dev', function() {
			return View::make( 'dev' )
				->nest( 'content', 'dev.overview' )
				->with( 'title', 'Overview' );
		}));

		// provided services
		Route::get('services/icons', array(
			'as' => 'dev.icons', function() {
			return View::make( 'dev' )
				->nest( 'content', 'dev.services.icons' )
				->with( 'title', 'Icons' );
		}));

		Route::get('services/embedWorldStats', array(
			'as' => 'dev.embedWorldStats', function() {
			return View::make( 'dev' )
				->nest( 'content', 'dev.services.embedWorldStats' )
				->with( 'title', 'Embedding WvW World Stats' );
		}));
	}
);

Route::group( array(
		'domain' => 'translate.' . Config::get('app.domain'),
		'before' => 'translateAuth|setLocaleDev|acceptCookies'
	), function() {
		Route::controller( '/', 'Barryvdh\TranslationManager\Controller' );
	}
);

// all main routes
Route::group( array(
		'domain' => '{language}.' . Config::get('app.domain'),
		'before' => 'setLocale|acceptCookies',
		'after' => ''
	), function() {
	
		// mainpage
		Route::get('/', array(
			'as' => 'home',
			'uses' => 'MainController@home'
		));
		
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
		// Skins
		//================================

		// bind the {skin} parameter in routes to the Item model
		Route::bind( 'skin', function( $id, $route ) {
			$skin = Skin::find( $id );
			if( is_null( $skin )) {
				throw new SkinNotFoundException( $id );
			}
			return $skin;
		});

		Route::get('skin', array(
			'as' => 'skin',
			'uses' => 'SkinController@overview'
		));

		Route::get('skin/armor', array(
			'as' => 'skin.armor',
			'uses' => 'SkinController@armor'
		));

		Route::get('skin/weapon', array(
			'as' => 'skin.weapon',
			'uses' => 'SkinController@weapon'
		));

		Route::get('skin/{skin}', array(
			'as' => 'skin.details',
			'uses' => 'SkinController@details'
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
		// STATS
		//================================

		// new items
		Route::get('stats/items/new', array(
			'as' => 'stats.items.new',
			'uses' => 'StatsController@itemsNew'
		));

		//================================
		// STUFF
		//================================

		// colors
		Route::get('colors', array(
			'as' => 'colors',
			function() {
				return View::make( 'layout' )
					->nest( 'content', 'colors' )
					->with( 'title', 'Colors' );
			}
		));

		// contact
		Route::get('contact', array(
			'as' => 'contact',
			function() {
				return View::make( 'layout' )
					->nest( 'content', 'contact' )
					->with( 'title', 'Contact' );
			}
		));

		// contact
		Route::get('about', array(
			'as' => 'about',
			function() {
				return View::make( 'layout' )
					->nest( 'content', 'about' )
					->with( 'title', 'About' );
			}
		));
	}
);
