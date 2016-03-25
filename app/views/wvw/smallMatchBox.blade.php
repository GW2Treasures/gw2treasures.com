<section class="smallMatchBox clearfix" data-match-id="{{ $match->id }}">
	<dl>
		<?php 
			$maxScore  = max( $match->red_score, $match->blue_score, $match->green_score ); 
			$maxIncome = max( $match->income[ Match::WORLD_RED ], $match->income[ Match::WORLD_BLUE ], $match->income[ Match::WORLD_GREEN ] );
			$cssClass  = array( Match::WORLD_GREEN => 'green', Match::WORLD_BLUE => 'blue', Match::WORLD_RED => 'red' )
		?>
		@foreach( array( Match::WORLD_GREEN, Match::WORLD_BLUE, Match::WORLD_RED ) as $world )
			<?php $isHomeworld = isset( $homeworld ) && $homeworld == $match->worlds[ $world ]; ?>
			<dt><a href="{{ URL::route('wvw.world', array( App::getLocale(), $match->worlds[ $world ]->id )) }}"{{ isset( $embedded ) ? ' target="_parent"' : '' }}>
				{{ $isHomeworld ? '<i class="sprite-16-homeworld"></i> ' : '' }}{{ $match->worlds[ $world ]->getName() }}</a></dt>
			<dd class="score"><span class="scoreBarLabel">{{ number_format( $match->score[ $world ], 0, '.', ' ' ) }}</span>
				<div class="scoreBar {{ $cssClass[ $world ] }}" style="width:{{ $maxScore > 0 ? $match->score[ $world ] / $maxScore * 100 : 0 }}%">&nbsp;</div>
			</dd>
			<dd class="income"><span class="scoreBarLabel">+{{ $match->income[ $world ] }}</span>
				<div class="scoreBar {{ $cssClass[ $world ] }}" style="width:{{ $maxIncome > 0 ? $match->income[ $world ] / $maxIncome * 100 : 0 }}%">&nbsp;</div>
			</dd>
			<dd class="objectives">
				<span>{{ $match->objectiveCounts[ $world ][ Objective::TYPE_CAMP   ] }}</span>
				<span>{{ $match->objectiveCounts[ $world ][ Objective::TYPE_TOWER  ] }}</span>
				<span>{{ $match->objectiveCounts[ $world ][ Objective::TYPE_KEEP   ] }}</span>
				<span>{{ $match->objectiveCounts[ $world ][ Objective::TYPE_CASTLE ] }}</span>
			</dd>
		@endforeach
	</dl>
</section>
