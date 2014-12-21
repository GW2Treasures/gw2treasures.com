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

        // about
        Route::get('about', array(
            'as' => 'about',
            'uses' => 'MainController@about'
        ));
    }
);
