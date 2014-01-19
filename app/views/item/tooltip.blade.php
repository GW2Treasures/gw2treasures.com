<div class="tooltip">
<header class="color-{{ $item->rarity }}">{{ $item->getName( ) }}</header>

{{-- weapon strength --}}
@if( $item->type == 'Weapon' )
	{{ trans( 'item.weaponStrength' ) }}: {{ $item->getTypeData( )->min_power }} – {{ $item->getTypeData( )->max_power }}
@endif

{{-- defense --}}
@if( $item->type == 'Armor' )
	{{ trans( 'item.defense' ) }}: {{ $item->getTypeData( )->defense }}
@endif

{{-- attributes --}}
@include( 'item.attributes' )

{{-- upgradeslot --}}
@include( 'item.upgradeslot' )

{{-- infusions --}}
@include( 'item.infusions' )

{{-- rarity --}}
@unless( $item->rarity == 'Basic' )
	{{ trans( 'item.rarity.' . $item->rarity ) }}<br>
@endunless

{{-- subtype --}}
@if( isset( $item->getTypeData()->type ) )
	{{ trans( 'item.type.' . $item->type ) }} ({{ trans( 'item.subtype.' . $item->type . '.' . $item->getTypeData()->type ) }})<br>
@elseif( $item->sub_type != '')
	{{ trans( 'item.type.' . $item->type ) }} ({{ trans( 'item.subtype.' . $item->type . '.' . $item->subtype ) }})<br>
@else
	{{ trans( 'item.type.' . $item->type ) }}<br>
@endif

{{-- weight --}}
@unless( $item->weight == 'None' )
	{{ trans( 'item.weight.' . $item->weight ) }}<br>
@endunless

{{-- required level --}}
@unless( $item->level == 0 )
	{{ trans( 'item.requiredLevel' )}}: {{ $item->level }}<br>
@endunless

{{-- description --}}
@unless( $item->getDescription() == '' )
	<p>{{ $item->getDescription() }}</p>
@endunless

{{-- unique --}}
@if( $item->hasFlag('Unique') )
	{{ trans( 'item.unique' ) }}<br>
@endif

{{-- soulbound --}}
@if( $item->hasFlag( 'AccountBound' ) )
	{{ trans( 'item.AccountBound' ) }}<br>
@endif
@if( $item->hasFlag( 'SoulbindOnAcquire' ) )
	{{ trans( 'item.SoulbindOnAcquire' ) }}<br>
@elseif( $item->hasFlag( 'SoulBindOnUse' ) )
	{{ trans( 'item.SoulBindOnUse' ) }}<br>
@endif

{{-- vendor value --}}
@unless( $item->hasFlag( 'NoSell' ) )
	@include( 'item.vendorValue' )<br>
@endunless

</div>