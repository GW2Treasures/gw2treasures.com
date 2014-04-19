<?php
	$types = array();
	foreach( $skins as $skin ) {
		$type = isset( $skin->getTypeData()->type )
		         ? $skin->getTypeData()->type
		         : $skin->type;

		if( !isset( $types[ $type ] ) ) {
			$types[ $type ] = array();
		}
		$types[ $type ][] = $skin;
	}
	ksort( $types );
?>

@foreach( $types as $type => $skins )
	<h2>{{ trans( 'skin.type.' . $type ) }}</h2>
	@foreach( $skins as $skin )
		<a href="{{ URL::route('skin.details', array( App::getLocale(), $skin->id )) }}"><img src="{{ $skin->getIconUrl(32) }}" srcset="{{ $skin->getIconUrl(32) }} 1x, {{ $skin->getIconUrl(64) }} 2x" width="32" height="32" title="{{ $skin->getName() }}"></a>
	@endforeach
@endforeach