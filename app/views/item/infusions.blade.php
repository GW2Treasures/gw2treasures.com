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
				@if( in_array( 'Defense', $infusion->flags ) )
					<li class="defensive"><i class="sprite-16-infusion-defense"></i> {{ trans('item.unusedDefensiveInfusionSlot') }}
				@elseif( in_array( 'Agony', $infusion->flags ) )
					<li class="defensive"><i class="sprite-16-infusion-defense"></i> {{ trans('item.unusedAgonyInfusionSlot') }}
				@elseif( in_array( 'Offense', $infusion->flags ) )
					<li class="offensive"><i class="sprite-16-infusion-offense"></i> {{ trans('item.unusedOffensiveInfusionSlot') }}
				@elseif( in_array( 'Utility', $infusion->flags ) )
					<li class="utility"><i class="sprite-16-infusion-utility"></i> {{ trans('item.unusedUtilityInfusionSlot') }}
				@endif
			@endif
		@endforeach
	</ul>
@endunless
