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

//Log::useFiles(storage_path().'/logs/laravel.log');

Log::useErrorLog();

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
	Log::error($exception, array( Request::url() ));

	if ( !Config::get( 'app.debug' ) ) {
		return Response::view('error', array( 
			'title' => $code == 500 ? 'whoops...' : $code, 
			'description' => 'There was an error (' . get_class( $exception ) . ').<br>' . $exception->getMessage() ?: '', 
		), $code);
	}
});

App::error( function( ItemNotFoundException $exception ) {
    return Response::make(
        View::make('layout', [
            'title' => '404 - Item '.$exception->itemId.' not found',
            'description' => 'We couldn\'t find the item '.$exception->itemId.'.',
            'fullWidth' => true
        ])->with('content', View::make('errors.404-item', ['itemId' => $exception->itemId])),
        404
    );
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


App::missing(function()
{
    return Response::make(
        View::make('layout', [
            'title' => '404 - Not found',
            'description' => 'We couldn\'t find the page you requested.',
            'fullWidth' => true
        ])->with('content', View::make('errors.404')),
        404
    );
});


Blade::extend(function($view, $compiler)
{
	// @highlight(<lang>)<code>@endhighlight
	$pattern = '/([\ \t]*)@highlight\(\'?([a-zA-Z0-9]+?)\'?\)(.*?)@endhighlight\s*/s';

	return preg_replace_callback( $pattern, function( $match ) {
		$indentation = $match[1];
		$language = $match[2];
		$content = preg_split( '/\r\n|\n|\r/', html_entity_decode( $match[3] ));

		$pygmentize = Config::get('app.pygmentize');
		$cmd = '"' . $pygmentize . '" -f html -O nowrap,startinline -l ' . $language;

		// parse the content ( remove indentations, tabs to spaces, ... )
		
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

		// remove tailing empty lines
		for ( $i = count( $parsedContent ) - 1; $i >= 0; $i--) { 
			if( trim( $parsedContent[ $i ] ) == '' ) {
				unset( $parsedContent[ $i ] );
			} else {
				break;
			}
		}

		// rebuild the parsed content
		$parsedContent = implode( "\n", $parsedContent );


		if( !is_executable( $pygmentize )) {
			// we cant run it, so just display the un-highlighted version with a short error message
			return '<div style="color:red">Path to pygmentize wrong or missing -x permission</div>' . e($parsedContent);
		}

		// map stdin, stdout and stderr
		$descriptorspec = array( 
			0 => array( 'pipe', 'r'),
			1 => array( 'pipe', 'w' ),
			2 => array( 'file', storage_path() . '/logs/pygmentize.log', 'a' )
		);

		// start the process
		$process = proc_open( $cmd, $descriptorspec, $pipes );
		if( is_resource( $process )) {
			// write the code to stdin
			fwrite( $pipes[0], $parsedContent );
			fclose( $pipes[0] );

			// read the highlighted html from stdout
			$output = stream_get_contents( $pipes[1] );
			fclose( $pipes[1] );

			// close the process
			proc_close( $process );

			// return highlighted code
			return $output;
		} else {
			// couldnt start pygmentize, show the un-highlighted code
			return '<div style="color:red">Error starting pygmentize</div>' . $parsedContent;
		}
	}, $view );
});
