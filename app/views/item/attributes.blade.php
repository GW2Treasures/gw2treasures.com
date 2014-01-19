@if( count( $item->getAttributes() ) > 0 )
	<dl class="attributes">
		@foreach( $item->getAttributes( ) as $attribute => $modifier )
			<dd>+{{ $modifier }}</dd><dt>{{ trans( 'item.attribute.' .   $attribute ) }}</dt>
		@endforeach
	</dl>
@endif