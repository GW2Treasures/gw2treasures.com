<?php $colors = Color::all(); ?>
<table style="width:100%">
	<thead>
		<tr>
			<th>Color</th>
			<!--<th>Base</th>-->
			<th>Cloth</th>
			<th>Leather</th>
			<th>Metal</th>
		</tr>
	</thead>
	<tbody>
		@foreach( $colors as $color )
			<tr>
				<th>{{ $color->getName() }}</th>
				<!--<td style="padding:5px;color:{{ Color::isDark($color->base_rgb) ? '#FFF' : '#111' }};background-color:#{{ Color::toHex($color->base_rgb) }}">#{{ Color::toHex($color->base_rgb) }}</td>-->
				<td style="padding:5px;color:{{ Color::isDark($color->cloth_rgb) ? '#FFF' : '#111' }};background-color:#{{ Color::toHex($color->cloth_rgb) }}">#{{ Color::toHex($color->cloth_rgb) }}</td>
				<td style="padding:5px;color:{{ Color::isDark($color->leather_rgb) ? '#FFF' : '#111' }};background-color:#{{ Color::toHex($color->leather_rgb) }}">#{{ Color::toHex($color->leather_rgb) }}</td>
				<td style="padding:5px;color:{{ Color::isDark($color->metal_rgb) ? '#FFF' : '#111' }};background-color:#{{ Color::toHex($color->metal_rgb) }}">#{{ Color::toHex($color->metal_rgb) }}</td>
			</tr>
		@endforeach
	</tbody>
</table>