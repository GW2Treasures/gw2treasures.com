<div class="banner">
	<div class="bannerSearch">
		{{ Form::open( array( 'method' => 'GET', 'route' => array('search', App::getLocale()), 'role' => 'search' )) }}
			<label for='mainsearch'>{{ trans('header.search.label') }}</label>
			<button type="submit" aria-label="{{ trans('header.search.label') }}"><i class="sprite-32-go"></i></button>
			<div class="bannerSearchInput">{{ Form::text( 'q', null, array( 'autofocus', 'id' => 'mainsearch', 'autocomplete' => 'off' )) }}</div>
			<div id="mainsearchAutocomplete"></div>
		{{ Form::close() }}
	</div>
</div>