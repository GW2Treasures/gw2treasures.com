<div class="tooltip">
<header class="color-{{ $item->rarity }}">{{ $item->getName( ) }}</header>

{{-- weapon strength --}}
@if( $item->type == 'Weapon' )
	{{ trans( 'item.weaponStrength' ) }}: {{ $item->getTypeData( )->min_power }} – {{ $item->getTypeData( )->max_power }}<br>
@endif

{{-- defense --}}
@if( $item->type == 'Armor' )
	{{ trans( 'item.defense' ) }}: {{ $item->getTypeData( )->defense }}<br>
@endif

{{-- attributes --}}
@include( 'item.attributes' )

{{-- consumable attributes --}}
@if( $item->type == 'Consumable' )
	@include('item.consumableBuff')
@endif

{{-- bonus --}}
@if( $item->type == 'UpgradeComponent' && ($item->subtype == 'Rune'  || $item->subtype == 'Default' ) && isset($item->getTypeData( )->bonuses) )
	<ol class="suffixBonusList">
		@foreach( $item->getTypeData( )->bonuses as $bonus )
			<li>{{ $bonus }}
		@endforeach
	</ol>
@endif

{{-- upgradeslot --}}
@include( 'item.upgradeslot' )

{{-- infusions --}}
@include( 'item.infusions' )

{{-- color --}}
@include( 'item.color' )

{{-- skin --}}
@unless( $item->skin_id == 0 )
	{{ trans( 'item.unlocksSkin' ) }}: 
	@if( !is_null( $item->unlocksSkin ))
		{{ $item->unlocksSkin->link(false) }}
	@else
		Unknown ({{ $item->skin_id }})
	@endif
	<br>
@endunless

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

{{-- requires race --}}
@if( count( $item->getData()->restrictions ) > 0 )
	{{ trans( 'item.requiresRace' )}}: {{ implode(', ', array_map( function( $race ) { return trans('item.race.' . $race ); }, $item->getData()->restrictions )) }}<br>
@endif

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

{{-- not salvagable --}}
@if( $item->hasFlag( 'NoSalvage' ) )
    <span class="muted">{{ trans( 'item.noSalvage') }}</span><br>
@endif

{{-- vendor value --}}
@if( $item->hasFlag( 'NoSell' ) )
    <span class="muted">{{ trans( 'item.noSell' ) }}</span><br>
@else
	@include( 'item.vendorValue' )<br>
@endif

</div>
