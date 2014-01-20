@unless( $item->hasFlag( 'NotUpgradeable' ) || !in_array( $item->type, array('Armor', 'Back', 'Weapon', 'Trinket')) )
	@if( !isset($item->getTypeData( )->suffix_item_id) || $item->getTypeData( )->suffix_item_id == '' )
		<div class="unusedUpgradeSlot">Unused Upgrade Slot</div>
	@else
		<div class="upgradeSlot">
			<img src="{{ $item->getSuffixItem( )->getIconUrl( 16 ) }}" width="16" height="16" alt><a href="{{ $item->getSuffixItem( )->getUrl( ) }}">{{ $item->getSuffixItem( )->getName( ) }}</a>

			@if( ( $suffixSubType = $item->getSuffixItem( )->subtype ) == 'Rune' )
				(0/{{ count( $bonuses = $item->getSuffixItem( )->getTypeData( )->bonuses ) }})
				<ol class="suffixBonusList">
					@foreach( $bonuses as $bonus )
						<li>{{ $bonus }}
					@endforeach
				</ol>
			@elseif( $suffixSubType == 'Sigil' || $suffixSubType == 'Gem' || $suffixSubType == 'Default' )
				@include( 'item.attributes', array( 'item' => $item->getSuffixItem( )) )
			@else
				Unknown UpgradeComponen {{ $suffixSubType }}
			@endif
		</div>
	@endif
@endunless