<div class="mainpageBanner">
	{{ Form::open( array( 'method' => 'GET', 'route' => array('search', App::getLocale() )) ) }}
		{{ Form::text( 'q', null, array( 'autofocus' )) }}
		{{ Form::submit() }}
	{{ Form::close() }}
</div>