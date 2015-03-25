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

{{-- consumable attributes --}}
@if( $item->type == 'Consumable' )
	<?php
		$duration_ms = isset( $item->getTypeData()->duration_ms ) ? $item->getTypeData()->duration_ms : false;
		$consumableAttributes = $item->getConsumableAttributes();
		if( $duration_ms === false && count( $consumableAttributes ) == 0 ) {
			$recipes = $item->recipes()->get();
			if( count( $recipes ) == 1 && $recipes[0]->totalIngredients == 1 ) {
				$ingredients = $recipes[0]->getIngredients();
				$duration_ms = 3600000;
				$consumableAttributes = $ingredients[0]->getConsumableAttributes();
			}
		}
	?>
	@if( $duration_ms !== false  )
		{{ trans( 'item.duration' ) }}: {{ Helper::duration( $duration_ms ) }}<br>
	@endif
	@if( count( $consumableAttributes ) > 0 )
		<dl class="attributes">
			@foreach( $consumableAttributes as $attribute => $modifier )
				@if( is_int( $attribute ) )
					<dt>{{ $modifier }}</dt>
				@else
					<dd>{{ $modifier }}</dd><dt>{{ $attribute }}</dt>
				@endif
			@endforeach
		</dl>
	@endif
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
		<a href="{{ URL::route('skin.details', array( App::getLocale(), $item->unlocksSkin->id )) }}">{{ $item->unlocksSkin->getName() }}</a>
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
