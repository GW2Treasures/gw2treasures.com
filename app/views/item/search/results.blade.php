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


<style>
	.chatlink-box {
		background: #f8f8f8;
		box-shadow: 0 1px 2px rgba(0,0,0,.2);
		display: inline-block;
		overflow: hidden;
		margin: 0 8px 8px 0;
		vertical-align: top;
		width: calc((100% - 16px) / 3);
	}
	.chatlink-box:nth-child(3n) {
		margin-right: 0;
	}

	@media(max-width: 900px) {
		.chatlink-box {
			width: calc((100% - 8px) / 2);
		}

		.chatlink-box:nth-child(3n) {
			margin-right: 8px;
		}
		.chatlink-box:nth-child(2n) {
			margin-right: 0;
		}
	}

	@media(max-width: 500px) {
		.chatlink-box {
			display: block;
			width: 100%;
			margin: 8px 0 0 0;
		}
	}

	.chatlink-box h3 {
		background: #fff;
		padding: 12px 8px;
		margin: 0;
		border-top: 2px solid #607D8B;
		box-shadow: 0 0 2px rgba(0,0,0,.2);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.chatlink-box__content {
		padding: 8px;
	}
	.chatlink-box__table {
		/*width: 100%;*/
	}
	.chatlink-box__table th {
		vertical-align: top;
		color: #222;
		font-weight: normal;
		text-align: left;
		padding-right: 8px;
	}
</style>
