@if( count( $item->getAttributes() ) > 0 )
	<dl class="attributes">
		@foreach( $item->getAttributes( ) as $attribute => $modifier )
			@if( is_int( $attribute ) )
				<dt>{{ $modifier }}</dt>
			@else
				<dd>+{{ $modifier }}</dd><dt>{{ trans( 'item.attribute.' .   $attribute ) }}</dt>
			@endif
		@endforeach
	</dl>
@endif