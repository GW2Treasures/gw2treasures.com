<div class="mainpageBanner">
	{{ Form::open( array( 'method' => 'GET', 'route' => array('search', App::getLocale() )) ) }}
		{{ Form::text( 'q', null, array( 'autofocus', 'id' => 'mainsearch', 'autocomplete' => 'off' )) }}
		{{ Form::submit() }}
		<div id="mainsearchAutocomplete"></div>
	{{ Form::close() }}
</div>