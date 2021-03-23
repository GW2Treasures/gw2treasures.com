<header class="header3" role="banner">
    <input hidden type="checkbox" id="menu-visible" value="1"/>

    <div class="header3__main">
        <label class="header3__menu" for="menu-visible">{{ trans('header.menu') }}</label>
        <a class="header3__search__link" href="{{ URL::route('search', App::getLocale()) }}">
            {{ trans('header.search.label') }}
        </a>

        <a class="header3__logo" href="/" accesskey="h">
            <img src="{{ App::environment('production') ? Helper::cdn('assets/img/logo.svg') : 'http://'.Config::get('app.domain').':8888/img/logo.svg' }}" alt="">
            Treasures
        </a>

        {{ Form::open([
                'method' => 'GET',
                'route' => ['search', App::getLocale()],
                'class' => 'header3__search',
                'role' => 'search',
                'id' => 'search',
                'itemprop' => 'potentialAction',
                'itemscope',
                'itemtype' => 'http://schema.org/SearchAction'
            ]) }}
        <meta itemprop="target" content="{{ URL::route('search', App::getLocale() ) }}?q={q}"/>
        {{ Form::text( 'q', null, [
            'class' => 'header3__search__input',
            'placeholder' => trans( 'header.search.placeholder' ),
            'aria-label' => trans( 'header.search.label' ),
            'id' => 'q',
            'autocomplete' => 'off',
            'accesskey' => 'f',
            'itemprop' => 'query-input' ])
        }}
        {{ Form::submit( trans( 'header.search.label' ), [ 'class' => 'header3__search__submit', 'tabindex' => '-1' ]) }}
        {{ Form::close() }}
    </div>
    <div class="header3__navigation">
        <a href="{{ URL::route('search', App::getLocale()) }}">{{ trans('header.items') }}
        </a><a href="{{ URL::route('achievement.overview', App::getLocale()) }}">{{ trans('header.achievements') }}
        </a><a href="{{ URL::route('skin', App::getLocale()) }}">{{ trans('skin.breadcrumb') }}
        </a>{{--            <a href="{{ URL::route('skill.overview', App::getLocale()) }}">{{ trans('skill.breadcrumb') }}
        </a>--}}<a href="{{ URL::route('profession.overview', App::getLocale()) }}">{{ trans('profession.breadcrumb') }}
        </a><a href="{{ URL::route('trait.overview', App::getLocale()) }}">{{ trans('trait.breadcrumb') }}
        </a><a href="{{ URL::route('specialization.overview', App::getLocale()) }}">{{ trans('specialization.breadcrumb') }}
        </a><a href="{{ URL::route('mount.overview', App::getLocale()) }}">{{ trans('mount.breadcrumb') }}
        </a><a href="{{ URL::route('wvw', App::getLocale()) }}">{{ trans('header.wvw') }}
        </a></div>
</header>

<div id="searchSuggestionbox">
    <div class="pageWidth">
        <header>{{ trans('header.search.items') }}</header>
        <ul id="searchSuggestionItems"></ul>
        <header>{{ trans('header.search.recent') }}</header>
        <ul id="searchSuggestionRecent"></ul>
    </div>
</div>
<div class="header3__shadow"></div>

<style>
</style>
