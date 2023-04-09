<h2>
	<a href="{{ route('skin', App::getLocale()) }}">{{ trans('skin.breadcrumb') }}</a>
	/ {{ trans('item.type.'.$type->type) }}
	/ {{ $subtype !== 'Back' ? trans( 'item.subtype.'.$type->type.'.'.$subtype->subtype ) : trans('item.type.Back') }}
</h2>

@if($type->type === 'Armor' && $subtype !== 'Back')
	@foreach($skins->groupBy(function($skin) { return $skin->getTypeData()->weight_class; }) as $weight => $skinsByWeight)
		<h3>{{ trans('item.weight.'.$weight) }}</h3>
		<ul class="itemList">
			@foreach($skinsByWeight as $skin)
				<li>{{ $skin->link(32) }}</li>
			@endforeach
		</ul>
	@endforeach
@else
	<ul class="itemList">
		@foreach($skins as $skin)
			<li>{{ $skin->link(32) }}</li>
		@endforeach
	</ul>
@endif
