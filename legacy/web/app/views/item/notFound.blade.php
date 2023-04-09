<h2>Item {{ $item }} not found :(</h2>

{{ Form::open( array( 'method' => 'GET', 'route' => array('search', App::getLocale() )) ) }}
	{{ Form::text( 'q', null, array('placeholder' => 'Search', 'class' => 'textbox', 'id' => 'searchInput' )) }}
	{{ Form::submit( null, array('class' => 'button') ) }}
{{ Form::close() }}