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
				<!--<td style="padding:5px;color:{{ Color::readableForecolor($color->base_rgb) }};background-color:#{{ Color::toColor($color->base_rgb) }}">#{{ Color::toColor($color->base_rgb) }}</td>-->
				<td style="padding:5px;color:{{ Color::readableForecolor($color->cloth_rgb) }};background-color:#{{ Color::toColor($color->cloth_rgb) }}">#{{ Color::toColor($color->cloth_rgb) }}</td>
				<td style="padding:5px;color:{{ Color::readableForecolor($color->leather_rgb) }};background-color:#{{ Color::toColor($color->leather_rgb) }}">#{{ Color::toColor($color->leather_rgb) }}</td>
				<td style="padding:5px;color:{{ Color::readableForecolor($color->metal_rgb) }};background-color:#{{ Color::toColor($color->metal_rgb) }}">#{{ Color::toColor($color->metal_rgb) }}</td>
			</tr>
		@endforeach
	</tbody>
</table>