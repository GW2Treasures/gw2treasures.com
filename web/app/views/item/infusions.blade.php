@unless( !isset( $item->getTypeData( )->infusion_slots ) || count( $item->getTypeData( )->infusion_slots ) == 0 )
	<ul class="infusion_slots">
		@foreach( $item->getTypeData( )->infusion_slots as $infusion )
			@if( isset( $infusion->item_id ) )
				<?php $infusion_item = Item::find( $infusion->item_id ); ?>
				<li>
					@if( !is_null( $infusion_item ))
						{{ $infusion_item->link(16) }}
					@else
						<span style="font-style: italic">Unknown infusion ({{ $infusion->item_id }})</span>
					@endif
			@else
				<li class="defensive"><i class="sprite-16-infusion-defense"></i> {{ trans('item.unusedInfusionSlot') }}
			@endif
		@endforeach
	</ul>
@endunless
