<h2>Searchresults for "{{ $searchterm }}"</h2>
{{ count($items) }} results.
@foreach( $items as $item )
	<div style="margin:2px">
		<a href="{{ $item->getUrl() }}">
			<img src="{{ $item->getIconUrl( 32 ) }}" width="32" height="32" alt="">
			{{ $item->getName() }}
		</a>
	</div>
@endforeach