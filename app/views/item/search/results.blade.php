@if( strlen( $query->searchTerm ) > 0 )
	<h2>Searchresults for "{{ $query->searchTerm }}" ({{ $query->getResults()->getTotal() }})</h2>

	@if($query->hasResults())
		<table class="table">
			<thead>
				<tr><th>Item</th><th>Type</th><th>Level</th></tr>
			</thead>
			<tbody>
				@foreach( $query->getResults() as $item )
					<tr>
						<th>{{ $item->link(32) }}</th>
						<td>
							@if( isset( $item->getTypeData()->type ) )
								{{ trans( 'item.type.' . $item->type ) }} ({{ trans( 'item.subtype.' . $item->type . '.' . $item->getTypeData()->type ) }})<br>
							@elseif( $item->sub_type != '')
								{{ trans( 'item.type.' . $item->type ) }} ({{ trans( 'item.subtype.' . $item->type . '.' . $item->subtype ) }})<br>
							@else
								{{ trans( 'item.type.' . $item->type ) }}<br>
							@endif
						</td>
						<td>{{ $item->getData()->level }}</td>
					</tr>
				@endforeach
			</tbody>
		</table>

		{{ $query->getResults()->links() }}
	@else
		No matching items found.
	@endif
@endif
