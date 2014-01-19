@unless( !isset( $item->getTypeData( )->infusion_slots ) || count( $item->getTypeData( )->infusion_slots ) == 0 )
	<ul class="infusion_slots">
		@foreach( $item->getTypeData( )->infusion_slots as $infusion )
			@if( isset( $infusion->item_id ) )
				<?php $i = Item::find( $infusion->item_id )->get(); ?>
				<li>
					<a href="{{ $i->getUrl() }}">
                		<img src="{{ $i->getIconUrl() }}" width="16" height="16" alt="">
                		{{ $i->getName() }}
            		</a>
			@else
				@if( in_array( 'Defense', $infusion->flags ) )
					<li class="defensive">{{ trans('item.unusedDefensiveInfusionSlot') }}
				@elseif( in_array( 'Offense', $infusion->flags ) )
					<li class="offensive">{{ trans('item.unusedOffensiveInfusionSlot') }}
				@elseif( in_array( 'Utility', $infusion->flags ) )
					<li class="utility">{{ trans('item.unusedUtilityInfusionSlot') }}
				@endif
			@endif
		@endforeach
	</ul>
@endunless