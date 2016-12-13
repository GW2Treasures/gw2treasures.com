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

        Route::get('services/embedWorldStats/update', array(
            'as' => 'dev.embedWorldStats.update', function() {
                return View::make( 'dev' )
                    ->nest( 'content', 'dev.services.updateWwWWidget' )
                    ->with( 'title', 'Update WvW Widget Domain' );
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

        Route::get('skins', function() {
            return Redirect::route('skin', App::getLocale());
        });

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

        Route::get('skin/{type}/{subtype}', [
            'as' => 'skin.byType',
            'uses' => 'SkinController@byType'
        ]);


        //================================
        // Achievements
        //================================

        Route::model( 'achievement', Achievement::class);
        Route::model( 'achievement_category', AchievementCategory::class);

        Route::get('achievement', [
            'as' => 'achievement.overview',
            'uses' => 'AchievementController@overview'
        ]);

        Route::get('achievement/category/{achievement_category}', [
            'as' => 'achievement.category',
            'uses' => 'AchievementController@category'
        ]);

        Route::get('achievement/random', [
            'as' => 'achievement.random',
            'uses' => 'AchievementController@random'
        ]);

        Route::get('achievement/{achievement}', [
            'as' => 'achievement.details',
            'uses' => 'AchievementController@details'
        ]);

        Route::get('achievement/{achievement}/json', [
            'as' => 'achievement.json',
            'uses' => 'AchievementController@json'
        ]);

        Route::get('achievement/{achievement}/tooltip', [
            'as' => 'achievement.tooltip',
            'uses' => 'AchievementController@tooltip'
        ]);


        //================================
        // Traits
        //================================

        Route::model('trait', Traits::class);

        Route::get('trait', [
            'as' => 'trait.overview',
            'uses' => 'TraitController@overview'
        ]);

        Route::get('trait/random', [
            'as' => 'trait.random',
            'uses' => 'TraitController@random'
        ]);

        Route::get('trait/{trait}', [
            'as' => 'trait.details',
            'uses' => 'TraitController@details'
        ]);

        Route::get('trait/{trait}/json', [
            'as' => 'trait.json',
            'uses' => 'TraitController@json'
        ]);

        Route::get('trait/{trait}/tooltip', [
            'as' => 'trait.tooltip',
            'uses' => 'TraitController@tooltip'
        ]);


        //================================
        // Specializations
        //================================

        Route::model('specialization', Specialization::class);

        Route::get('specialization', [
            'as' => 'specialization.overview',
            'uses' => 'SpecializationController@overview'
        ]);
    
        Route::get('specialization/random', [
            'as' => 'specialization.random',
            'uses' => 'SpecializationController@random'
        ]);

        Route::get('specialization/{specialization}', [
            'as' => 'specialization.details',
            'uses' => 'SpecializationController@details'
        ]);

        Route::get('specialization/{specialization}/json', [
            'as' => 'specialization.json',
            'uses' => 'SpecializationController@json'
        ]);


        //================================
        // Professions
        //================================

        Route::model('profession', Profession::class);

        Route::get('profession', [
            'as' => 'profession.overview',
            'uses' => 'ProfessionController@overview'
        ]);

        Route::get('profession/random', [
            'as' => 'profession.random',
            'uses' => 'ProfessionController@random'
        ]);

        Route::get('profession/{profession}', [
            'as' => 'profession.details',
            'uses' => 'ProfessionController@details'
        ]);

        Route::get('profession/{profession}/json', [
            'as' => 'profession.json',
            'uses' => 'ProfessionController@json'
        ]);

        //================================
        // Skills
        //================================

        Route::model('skill', Skill::class);

        Route::get('skill', [
            'as' => 'skill.overview',
            'uses' => 'SkillController@overview'
        ]);

        Route::get('skill/random', [
            'as' => 'skill.random',
            'uses' => 'SkillController@random'
        ]);

        Route::get('skill/{skill}', [
            'as' => 'skill.details',
            'uses' => 'SkillController@details'
        ]);

        Route::get('skill/{skill}/json', [
            'as' => 'skill.json',
            'uses' => 'SkillController@json'
        ]);

        Route::get('skill/{skill}/tooltip', [
            'as' => 'skill.tooltip',
            'uses' => 'SkillController@tooltip'
        ]);

        //================================
        // WVW
        //================================

        // bind the {world} parameter in routes to the Item model
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
        // SEARCH
        //================================

        Route::get('search', [
            'as' => 'search',
            'uses' => 'SearchController@search'
        ]);

        Route::get('search/autocomplete', array(
            'as' => 'search.autocomplete',
            'uses' => 'SearchController@autocomplete'
        ));

        Route::get('search/{type}',  array(
            'as' => 'search.results',
            'uses' => 'SearchController@results'
        ));

        //================================
        // STUFF
        //================================

        // api
        Route::get('{endpoint}/{id}/api', function($lang, $endpoint, $id) {
            return Redirect::to("https://api.guildwars2.com/v2/{$endpoint}s/$id?lang=$lang");
        })->where('endpoint', 'item|skin|achievement|trait|profession|skill|specialization');

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

        // sitemap
        Route::get('sitemap/{type?}/{page?}', [
            'as' => 'sitemap',
            'uses' => 'SitemapController@getIndex'
        ]);
    }
);
