<header id="header" class="clearfix" role="banner">
	<div class="pageWidth">
		<h1><a href="/" accesskey="h">GW2 Treasures</a></h1>

		<span class="menu-button">{{ trans('header.menu') }}</span>

		<div class="left">
			<a class="headerButton" href="{{ URL::route('search', App::getLocale()) }}">{{ trans('header.items') }}</a>
			<a class="headerButton" href="{{ URL::route('achievement.overview', App::getLocale()) }}">{{ trans('header.achievements') }}</a>
			<a class="headerButton" href="{{ URL::route('wvw', App::getLocale()) }}">{{ trans('header.wvw') }}</a>
		</div>

		<div class="right">
			{{ Form::open( array( 
				'method' => 'GET',
				'route' => array('search', App::getLocale()),
				'class' => 'searchForm',
				'role' => 'search',
				'id' => 'search',
				'itemprop' => 'potentialAction',
				'itemscope',
				'itemtype' => 'http://schema.org/SearchAction' ))
			}}
                <meta itemprop="target" content="{{ URL::route('search', App::getLocale() ) }}?q={q}"/>
				<label for='q'></label>
				{{ Form::text( 'q', null, array(
					'placeholder' => trans( 'header.search.label' ),
					'aria-label' => trans( 'header.search.label' ),
					'id' => 'q',
					'autocomplete' => 'off',
					'accesskey' => 'f',
			        'itemprop' => 'query-input' ))
				}}
				<div id="searchSuggestionbox">
					<header>{{ trans('header.search.items') }}</header>
					<ul id="searchSuggestionItems"></ul>
					<header>{{ trans('header.search.recent') }}</header>
					<ul id="searchSuggestionRecent"></ul>
				</div>
				{{ Form::submit( trans( 'header.search.label' ), array( 'class' => 'submit', 'tabindex' => '-1' )) }}
			{{ Form::close() }}
		</div>
	</div>
</header>
