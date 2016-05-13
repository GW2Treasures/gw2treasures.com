@if($query->hasChatlinks())
	<h2>{{ trans_choice('misc.chatlink.header', count($query->getChatlinks())) }}</h2>

	<div class="chatlinks">
		@foreach($query->getChatlinks() as $chatlink){{--
		--}}<div class="chatlink-box">
			<h3>{{ $chatlink->encode() }}</h3>
			<div class="chatlink-box__content">
				@if($chatlink->getType() === $chatlink::TYPE_COIN)
					@include('item.search.chatlink.coin')
				@elseif($chatlink->getType() === $chatlink::TYPE_ITEM)
					@include('item.search.chatlink.item')
				@elseif($chatlink->getType() === $chatlink::TYPE_SKIN)
					@include('item.search.chatlink.skin')
				@elseif($chatlink->getType() === $chatlink::TYPE_TRAIT)
					@include('item.search.chatlink.trait')
				@else
					Unknown type 0x{{ substr('0'.dechex($chatlink->getType()), -2) }}
				@endif
			</div>
		</div>{{--
	--}}@endforeach
	</div>
@endif

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
