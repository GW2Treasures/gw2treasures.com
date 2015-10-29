{{ Form::open( array( 'method' => 'GET', 'route' => array('search', App::getLocale() )) ) }}
	{{ Form::text( 'q', $searchterm, array('placeholder' => 'Search', 'class' => 'textbox', 'id' => 'searchInput' )) }}
	{{ Form::submit( null, array('class' => 'button') ) }}
{{ Form::close() }}

@if( strlen( $searchterm ) > 0 )
	<h2>Searchresults for "{{ $searchterm }}"</h2>
	{{ count($items) }} results.
	<ul class="itemList">
		@foreach( $items as $item )
			<li>{{ $item->link(32) }}</li>
		@endforeach
	</ul>
@endif
