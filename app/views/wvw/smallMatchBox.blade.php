<?php
	$maxScore  = max($match->red_score, $match->blue_score, $match->green_score);
	$maxIncome = max($match->income[Match::WORLD_RED], $match->income[Match::WORLD_BLUE], $match->income[Match::WORLD_GREEN]);
	$cssClass  = [Match::WORLD_GREEN => 'green', Match::WORLD_BLUE => 'blue', Match::WORLD_RED => 'red'];
?>
@foreach($match->allWorlds as $side => $worlds)
	<tr class="wvw-table__row--{{ $cssClass[$side] }}">
		<td class="wvw-table__worlds">
			@for($i = 0; $i < count($worlds); $i++)
				<a href="{{ route('wvw.world', [App::getLocale(), $worlds[$i]->id]) }}"{{ isset($embedded) ? ' target="_parent"' : '' }}>
				@if(isset($homeworld) && $worlds[$i] == $homeworld)
						<svg class="wvw-table__homeworld__icon" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M15 30v-9h6v9h7.5V18H33L18 4.5 3 18h4.5v12"/></svg>
				@endif
				{{ $worlds[$i]->getName() }}</a>{{ $i != count($worlds) - 1 ? ' / ' : '' }}
			@endfor
		</td>
		<td class="wvw-table__score">
			<span class="wvw-table__score__label">
				{{ number_format( $match->score[$side], 0, '.', ' ' ) }}
				<span class="wvw-table__score__label__income">(+{{ $match->income[$side] }})</span>
			</span>
			<span class="wvw-table__score__bar wvw-table__score__bar--{{ $cssClass[$side] }}"
				  style="width:{{ $maxScore > 0 ? $match->score[$side] / $maxScore * 100 : 0 }}%">&nbsp;</span>
		</td>
		<td class="wvw-table__income">
			<span class="wvw-table__income__label">+{{ $match->income[$side] }}</span>
			<div class="wvw-table__income__bar wvw-table__income__bar--{{ $cssClass[$side] }}"
				 style="width:{{ $maxIncome > 0 ? $match->income[$side] / $maxIncome * 100 : 0 }}%">&nbsp;</div>
		</td>
		<td class="wvw-table__objectives">
			<span>{{ $match->objectiveCounts[$side][ Objective::TYPE_CAMP   ] }}</span>
			<span>{{ $match->objectiveCounts[$side][ Objective::TYPE_TOWER  ] }}</span>
			<span>{{ $match->objectiveCounts[$side][ Objective::TYPE_KEEP   ] }}</span>
			<span>{{ $match->objectiveCounts[$side][ Objective::TYPE_CASTLE ] }}</span>
		</td>
	</tr>
@endforeach
