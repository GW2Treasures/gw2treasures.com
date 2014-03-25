@if( isset( $item->getTypeData()->type ) && $item->getTypeData()->type == 'Unlock' && isset( $item->getTypeData()->unlock_type ) && $item->getTypeData()->unlock_type == 'Dye' && isset( $item->getTypeData()->color_id ))
	<?php $color = Color::find( $item->getTypeData()->color_id ); ?>
	<div class="unlocked-color">
		{{ $color->getName() }}:<br>
		<div class="color-field" title="#{{ Color::toColor($color->cloth_rgb) }}" style="background-color:#{{ Color::toColor($color->cloth_rgb) }}"></div>
		<div class="color-field" title="#{{ Color::toColor($color->leather_rgb) }}" style="background-color:#{{ Color::toColor($color->leather_rgb) }}"></div>
		<div class="color-field" title="#{{ Color::toColor($color->metal_rgb) }}" style="background-color:#{{ Color::toColor($color->metal_rgb) }}"></div>
	</div>
@endif