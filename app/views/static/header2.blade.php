<header class="header2" role="banner">
    <input hidden type="checkbox" id="menu-visible" value="1"/>
    <input hidden type="checkbox" id="search-visible" value="1"/>

    <label class="header2__menu" for="menu-visible">Menu</label>
    <a class="header2__logo" href="/" tabindex="-1" aria-hidden="true"></a>

    <div class="header2__content">
        <div class="header2__content__top">
            <a class="header2__title" href="/" accesskey="h">Treasures</a>
            <label class="header2__search__label" for="search-visible"></label>
            {{ Form::open([
                'method' => 'GET',
                'route' => ['search', App::getLocale()],
                'class' => 'header2__search',
                'role' => 'search',
                'id' => 'search',
                'itemprop' => 'potentialAction',
                'itemscope',
                'itemtype' => 'http://schema.org/SearchAction'
            ]) }}
            <meta itemprop="target" content="{{ URL::route('search', App::getLocale() ) }}?q={q}"/>
            {{ Form::text( 'q', null, [
                'class' => 'header2__search__input',
                'placeholder' => trans( 'header.search.placeholder' ),
                'aria-label' => trans( 'header.search.label' ),
                'id' => 'q',
                'autocomplete' => 'off',
                'accesskey' => 'f',
                'itemprop' => 'query-input' ])
            }}
            <div id="searchSuggestionbox">
                <header>{{ trans('header.search.items') }}</header>
                <ul id="searchSuggestionItems"></ul>
                <header>{{ trans('header.search.recent') }}</header>
                <ul id="searchSuggestionRecent"></ul>
            </div>
            {{ Form::submit( trans( 'header.search.label' ), [ 'class' => 'header2__search__submit', 'tabindex' => '-1' ]) }}
            {{ Form::close() }}
        </div>
        <div class="header2__content__bottom">
            <a class="headerButton" href="{{ URL::route('search', App::getLocale()) }}">{{ trans('header.items') }}</a>
            <a class="headerButton" href="{{ URL::route('achievement.overview', App::getLocale()) }}">{{ trans('header.achievements') }}</a>
            <a class="headerButton" href="{{ URL::route('skin', App::getLocale()) }}">{{ trans('skin.breadcrumb') }}</a>
{{--            <a class="headerButton" href="{{ URL::route('skill.overview', App::getLocale()) }}">{{ trans('skill.breadcrumb') }}</a>--}}
            <a class="headerButton" href="{{ URL::route('profession.overview', App::getLocale()) }}">{{ trans('profession.breadcrumb') }}</a>
            <a class="headerButton" href="{{ URL::route('trait.overview', App::getLocale()) }}">{{ trans('trait.breadcrumb') }}</a>
            <a class="headerButton" href="{{ URL::route('specialization.overview', App::getLocale()) }}">{{ trans('specialization.breadcrumb') }}</a>
            <a class="headerButton" href="{{ URL::route('wvw', App::getLocale()) }}">{{ trans('header.wvw') }}</a>
        </div>
    </div>
</header>
