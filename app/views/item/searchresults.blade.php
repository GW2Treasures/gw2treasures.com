{{ Form::open( array( 'method' => 'GET', 'route' => array('search', App::getLocale() )) ) }}
	{{ Form::text( 'q', $searchterm, array('placeholder' => 'Search', 'class' => 'textbox', 'id' => 'searchInput' )) }}
	{{ Form::submit( null, array('class' => 'button') ) }}
{{ Form::close() }}

@if( strlen( $searchterm ) > 0 )
	<h2>Searchresults for "{{ $searchterm }}"</h2>
	{{ count($items) }} results.
	@foreach( $items as $item )
		<div style="margin:2px">
			<a data-item-id="{{ $item->id }}" href="{{ $item->getUrl() }}">
				<img src="{{ $item->getIconUrl( 32 ) }}" width="32" height="32" alt="">
				{{ $item->getName() }}
			</a>
		</div>
	@endforeach
@endif