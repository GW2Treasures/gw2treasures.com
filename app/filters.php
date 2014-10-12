<?php

/*
|--------------------------------------------------------------------------
| Application & Route Filters
|--------------------------------------------------------------------------
|
| Below you will find the "before" and "after" events for the application
| which may be used to do any work before or after a request into your
| application. Here you may also register your custom route filters.
|
*/

App::before(function($request)
{
	//
});


App::after(function($request, $response)
{
	//
});

/*
|--------------------------------------------------------------------------
| Authentication Filters
|--------------------------------------------------------------------------
|
| The following filters are used to verify that the user of the current
| session is logged into this application. The "basic" filter easily
| integrates HTTP Basic authentication for quick, simple checking.
|
*/

Route::filter('auth', function()
{
	if (Auth::guest()) return Redirect::guest('login');
});


Route::filter('auth.basic', function()
{
	return Auth::basic();
});

/*
|--------------------------------------------------------------------------
| Guest Filter
|--------------------------------------------------------------------------
|
| The "guest" filter is the counterpart of the authentication filters as
| it simply checks that the current user is not logged in. A redirect
| response will be issued if they are, which you may freely change.
|
*/

Route::filter('guest', function()
{
	if (Auth::check()) return Redirect::to('/');
});

/*
|--------------------------------------------------------------------------
| CSRF Protection Filter
|--------------------------------------------------------------------------
|
| The CSRF filter is responsible for protecting your application against
| cross-site request forgery attacks. If this special token in a user
| session does not match the one given in this request, we'll bail.
|
*/

Route::filter('csrf', function()
{
	if (Session::token() != Input::get('_token'))
	{
		throw new Illuminate\Session\TokenMismatchException;
	}
});

/*
|--------------------------------------------------------------------------
| Localization Filters
|--------------------------------------------------------------------------
|
| Filters to redirect to the correct localized version of the website
|
*/

Route::filter( 'setLocale',	function( $route, $request ) {
	/** @var \Illuminate\Routing\Route  $route   */
	/** @var \Illuminate\Http\Request   $request */
	$parameters = $route->parameters();
	$lang = array_key_exists( 'language', $parameters ) ? $parameters[ 'language' ] : '';

	// available languages
	// 'en' as first language so it gets picked if no other language matches
	$availableLanguages = array( 'en', 'de', 'es', 'fr' );

	// handle invalid languages
	if( !in_array( $lang, $availableLanguages )) {
		// check if we have a valid language in the session
		if ( in_array( Session::get( 'language'), $availableLanguages )) {
			$lang = Session::get( 'language' );
		} else {
			// get the preferred language for the visitor
			$lang = Helper::prefered_language( $availableLanguages );

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
	/** @var \Illuminate\Routing\Route  $route   */
	/** @var \Illuminate\Http\Request   $request */

	// available languages
	// 'en' as first language so it gets picked if no other language matches
	$availableLanguages = array( 'en', 'de', 'es', 'fr' );

	if( in_array( $request->get('l'), $availableLanguages )) {
		// switching language
		$lang = $request->get('l');
	} elseif( in_array( Session::get( 'language'), $availableLanguages )) {
		// get language from session
		$lang = Session::get( 'language');
	} else {
		// get the preferred language for the visitor
		$lang = Helper::prefered_language( $availableLanguages );

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


/*
|--------------------------------------------------------------------------
| Miscellaneous Filters
|--------------------------------------------------------------------------
|
| All sorts of different filters used for different routes
|
*/

/**
 * Show the cookie notification if it has not been shown yet
 */
Route::filter( 'acceptCookies', function() {
	if( !Session::has( 'acceptCookies' )) {
		Session::put( 'acceptCookies', true );
		Notification::Add( 'acceptCookies', 'notifications.cookies' );
	}
});

/**
 * authenticate for the translate-subdomain
 */
Route::filter( 'translateAuth', function( $route, $request ) {
	/** @var \Illuminate\Routing\Route  $route   */
	/** @var \Illuminate\Http\Request   $request */

	if( Session::get( 'translate.authenticated' ) !== true ) {
		if( $request->getUser() == 'translate' && $request->getPassword() == Config::get( 'app.translatePassword' )) {
			Session::put( 'translate.authenticated', true );
		} else {
			$headers = array( 'WWW-Authenticate' => 'Basic' );
			return Response::make( 'Invalid credentials.', 401, $headers );
		}
	}
});