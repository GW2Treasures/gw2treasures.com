@unless( $item->hasFlag( 'NotUpgradeable' ) || !in_array( $item->type, array('Armor', 'Back', 'Weapon', 'Trinket')) )
	{{-- slot1 --}}
	@if( !isset($item->getTypeData()->suffix_item_id) || $item->getTypeData()->suffix_item_id == '' )
		<div class="unusedUpgradeSlot"><i class="sprite-18-upgradeslot"></i> {{ trans('item.unusedUpgradeSlot') }}</div>
	@else
		<div class="upgradeSlot">
			@if( !is_null( $item->getSuffixItem() ))
				{{ $item->getSuffixItem()->link( 16 ) }}

				@if( (( $suffixSubType = $item->getSuffixItem()->subtype ) == 'Rune' || $suffixSubType == 'Default') )
					@include( 'item.attributes', array('item' => $item->getSuffixItem()) )
					@if( isset( $item->getSuffixItem()->getTypeData()->bonuses ) )
						&nbsp;(0/{{ count( $bonuses = $item->getSuffixItem()->getTypeData()->bonuses ) }})
						<ol class="suffixBonusList">
							@foreach( $bonuses as $bonus )
								<li>{{ $bonus }}
							@endforeach
						</ol>
					@endif
				@elseif( $suffixSubType == 'Sigil' || $suffixSubType == 'Gem' )
					@include( 'item.attributes', array( 'item' => $item->getSuffixItem()) )
				@else
					Unknown UpgradeComponent {{ $suffixSubType }}
				@endif
			@else
				Unknown Upgrade ({{ $item->suffix_item_id }})
			@endif
		</div>
	@endif

	{{-- slot2 --}}
	@if( $item->type == 'Weapon' && in_array( $item->subtype, array( 'Greatsword', 'Hammer', 'Longbow', 'Rifle', 'Shortbow', 'Staff' )) )
		@if( !isset($item->getTypeData()->secondary_suffix_item_id) || $item->getTypeData()->secondary_suffix_item_id == '' )
			<div class="unusedUpgradeSlot"><i class="sprite-18-upgradeslot"></i> {{ trans('item.unusedUpgradeSlot') }}</div>
		@else
			<div class="upgradeSlot">
				{{ $item->getSecondarySuffixItem()->link( 16 ) }}

				@if( (( $suffixSubType = $item->getSecondarySuffixItem()->subtype ) == 'Rune' || $suffixSubType == 'Default') )
					@include( 'item.attributes', array('item' => $item->getSecondarySuffixItem()) )
					@if( isset( $item->getSecondarySuffixItem()->getTypeData()->bonuses ) )
						&nbsp;(0/{{ count( $bonuses = $item->getSecondarySuffixItem()->getTypeData()->bonuses ) }})
						<ol class="suffixBonusList">
							@foreach( $bonuses as $bonus )
								<li>{{ $bonus }}
							@endforeach
						</ol>
					@endif
				@elseif( $suffixSubType == 'Sigil' || $suffixSubType == 'Gem' )
					@include( 'item.attributes', array( 'item' => $item->getSecondarySuffixItem()) )
				@else
					Unknown UpgradeComponent {{ $suffixSubType }}
				@endif
			</div>
		@endif
	@endif
@endunless
