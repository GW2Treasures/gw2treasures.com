<section class="smallMatchBox clearfix" data-match-id="{{ $match->id }}">
	<dl>
		<?php $maxScore  = max( $match->red_score, $match->blue_score, $match->green_score ); ?>
		<?php $maxIncome = max( $match->income[ Match::WORLD_RED ], $match->income[ Match::WORLD_BLUE ], $match->income[ Match::WORLD_GREEN ] ); ?>

		<dt>{{ Match::getWorldName( $match->green_world_id ) }}</dt>
		<dd class="score"><div class="scoreBar green" data-score="{{$match->green_score}}" style="width:{{ $match->green_score / $maxScore * 100 }}%">
				{{ number_format( $match->green_score, 0, '.', ' ' ) }}
		</div></dd>
		<dd class="income"><div class="scoreBar green" data-score="{{$match->green_score}}" style="width:{{ $match->income[ Match::WORLD_GREEN ] / $maxIncome * 100 }}%">
				+{{ $match->income[ Match::WORLD_GREEN ] }}
		</div></dd>
		<dd class="objectives">
			<span>{{ $match->objectiveCounts[ Match::WORLD_GREEN ][ Objective::TYPE_CAMP   ] }}</span>
			<span>{{ $match->objectiveCounts[ Match::WORLD_GREEN ][ Objective::TYPE_TOWER  ] }}</span>
			<span>{{ $match->objectiveCounts[ Match::WORLD_GREEN ][ Objective::TYPE_KEEP   ] }}</span>
			<span>{{ $match->objectiveCounts[ Match::WORLD_GREEN ][ Objective::TYPE_CASTLE ] }}</span>
		</dd>

		<dt>{{ Match::getWorldName( $match->blue_world_id ) }}</dt>
		<dd class="score"><div class="scoreBar blue" data-score="{{$match->blue_score}}" style="width:{{ $match->blue_score / $maxScore * 100 }}%">
				{{ number_format( $match->blue_score, 0, '.', ' ' ) }}
		</div></dd>
		<dd class="income"><div class="scoreBar blue" data-score="{{$match->blue_score}}" style="width:{{ $match->income[ Match::WORLD_BLUE ] / $maxIncome * 100 }}%">
				+{{ $match->income[ Match::WORLD_BLUE ] }}
		</div></dd>
		<dd class="objectives">
			<span>{{ $match->objectiveCounts[ Match::WORLD_BLUE ][ Objective::TYPE_CAMP   ] }}</span>
			<span>{{ $match->objectiveCounts[ Match::WORLD_BLUE ][ Objective::TYPE_TOWER  ] }}</span>
			<span>{{ $match->objectiveCounts[ Match::WORLD_BLUE ][ Objective::TYPE_KEEP   ] }}</span>
			<span>{{ $match->objectiveCounts[ Match::WORLD_BLUE ][ Objective::TYPE_CASTLE ] }}</span>
		</dd>

		<dt>{{ Match::getWorldName( $match->red_world_id ) }}</dt>
		<dd class="score"><div class="scoreBar red" data-score="{{$match->red_score}}" style="width:{{ $match->red_score / $maxScore * 100 }}%">
				{{ number_format( $match->red_score, 0, '.', ' ' ) }}
		</div></dd>
		<dd class="income"><div class="scoreBar red" data-score="{{$match->red_score}}" style="width:{{ $match->income[ Match::WORLD_RED ] / $maxIncome * 100 }}%">
				+{{ $match->income[ Match::WORLD_RED ] }}
		</div></dd>
		<dd class="objectives">
			<span>{{ $match->objectiveCounts[ Match::WORLD_RED ][ Objective::TYPE_CAMP   ] }}</span>
			<span>{{ $match->objectiveCounts[ Match::WORLD_RED ][ Objective::TYPE_TOWER  ] }}</span>
			<span>{{ $match->objectiveCounts[ Match::WORLD_RED ][ Objective::TYPE_KEEP   ] }}</span>
			<span>{{ $match->objectiveCounts[ Match::WORLD_RED ][ Objective::TYPE_CASTLE ] }}</span>
		</dd>
	</dl>
</section>