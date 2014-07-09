<?php

/*
|--------------------------------------------------------------------------
| Register The Laravel Class Loader
|--------------------------------------------------------------------------
|
| In addition to using Composer, you may use the Laravel class loader to
| load your controllers and models. This is useful for keeping all of
| your classes in the "global" namespace without Composer updating.
|
*/

ClassLoader::addDirectories(array(

	app_path().'/commands',
	app_path().'/controllers',
	app_path().'/models',
	app_path().'/database/seeds',
	app_path().'/library',

));

/*
|--------------------------------------------------------------------------
| Application Error Logger
|--------------------------------------------------------------------------
|
| Here we will configure the error logger setup for the application which
| is built on top of the wonderful Monolog library. By default we will
| build a basic log file setup which creates a single file for logs.
|
*/

Log::useFiles(storage_path().'/logs/laravel.log');

/*
|--------------------------------------------------------------------------
| Application Error Handler
|--------------------------------------------------------------------------
|
| Here you may handle any errors that occur in your application, including
| logging them or displaying custom views for specific errors. You may
| even register several error handlers to handle different types of
| exceptions. If nothing is returned, the default error view is
| shown, which includes a detailed stack trace during debug.
|
*/

App::error(function(Exception $exception, $code)
{
	Log::error($exception);

	if ( !Config::get( 'app.debug' ) ) {
		return Response::view('error', array( 
			'title' => $code == 500 ? 'whoops...' : $code, 
			'description' => 'There was an error (' . get_class( $exception ) . ').<br>' . $exception->getMessage() ?: '', 
		), $code);
	}
});

App::error( function( ItemNotFoundException $exception ) {
	return Response::view(
		'layout', array(
			'content' => View::make( 'item.notFound' )
				->with( 'item', $exception->itemId ),
			'title' => 'Item ' . $exception->itemId . ' not found'
	), 404);
});

/*
|--------------------------------------------------------------------------
| Maintenance Mode Handler
|--------------------------------------------------------------------------
|
| The "down" Artisan command gives you the ability to put an application
| into maintenance mode. Here, you will define what is displayed back
| to the user if maintenance mode is in effect for the application.
|
*/

App::down(function()
{
	//return Response::make("Be right back!", 503);
	return Response::view('error', array( 
		'title' => 'Maintenance', 
		'description' => 'Be right back!' 
	), 503);
});

/*
|--------------------------------------------------------------------------
| Require The Filters File
|--------------------------------------------------------------------------
|
| Next we will load the filters file for the application. This gives us
| a nice separate location to store our route and application filter
| definitions instead of putting them all in the main routes file.
|
*/

require app_path().'/filters.php';


App::missing(function($exception)
{
	return Response::view('error', array( 
		'title' => '404', 
		'description' => 'We couldn\'t find the file you requested.' 
	), 404);
});


Blade::extend(function($view, $compiler)
{
	$pattern = '/([\ \t]*)@highlight\(\'?([^)]+?)\'?\)(.*?)@endhighlight\s*/s';

	return preg_replace_callback( $pattern, function( $match ) {
		$indentation = $match[1];
		$language = $match[2];
		$content = preg_split( '/\r\n|\n|\r/', html_entity_decode( $match[3] ));

		$parsedContent = array();

		$firstLine = true;
		for ( $i = 0; $i < count( $content ); $i++ ) {
			if( $firstLine && trim( $content[ $i ] ) == '' ) {
				continue;
			} else {
				if( $firstLine ) { 
					preg_match('/^' . $indentation . '[\ \t]*/', $content[ $i ], $m );
					$indentation = $m[0];
				}
				$parsedContent[] = str_replace( "\t", '    ', preg_replace( '/^' . $indentation . '/', '', $content[ $i ] ));
			}
			$firstLine = false;
		}

		for ( $i = count( $parsedContent ) - 1; $i >= 0; $i--) { 
			if( trim( $parsedContent[ $i ] ) == '' ) {
				unset( $parsedContent[ $i ] );
			} else {
				break;
			}
		}

		$parsedContent = implode( "\n", $parsedContent );

		$tmp = tempnam( storage_path() . '/temp', 'pygmentize_' );
		file_put_contents( $tmp, $parsedContent );
		$cmd = '"D:\Programme\Python\Python341\Scripts\pygmentize.exe" -f html -O nowrap,startinline -l "' . $language . '" "' . $tmp . '"';
		exec( $cmd, $output, $returnVal );

		//dd( $returnVal );
		//dd( $output );

		return implode( "\n", $output );

		//dd( pygmentize( $parsedContent, $language ) );

		return var_export( array( $indentation, $language, $parsedContent ), true );

		return '--highlight--';

	}, $view );

	return preg_replace($pattern, '--highlight--', $view);
});