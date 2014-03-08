<section class="smallMatchBox clearfix" data-match-id="{{ $match->id }}">
	<dl>
		<?php $maxScore = max( $match->red_score, $match->blue_score, $match->green_score ); ?>
		<dt>{{ Match::getWorldName( $match->red_world_id ) }}</dt>
		<dd><div class="scoreBar red" data-score="{{$match->red_score}}" style="width:{{ $match->red_score / $maxScore * 100 }}%">{{ $match->red_score }} <span class="income">(+{{ $match->income[ Match::WORLD_RED ] }})</span></div></dd>
		<dt>{{ Match::getWorldName( $match->blue_world_id ) }}</dt>
		<dd><div class="scoreBar blue" data-score="{{$match->blue_score}}" style="width:{{ $match->blue_score / $maxScore * 100 }}%">{{ $match->blue_score }} <span class="income">(+{{ $match->income[ Match::WORLD_BLUE ] }})</span></div></dd>
		<dt>{{ Match::getWorldName( $match->green_world_id ) }}</dt>
		<dd><div class="scoreBar green" data-score="{{$match->green_score}}" style="width:{{ $match->green_score / $maxScore * 100 }}%">{{ $match->green_score }} <span class="income">(+{{ $match->income[ Match::WORLD_GREEN ] }})</span></div></dd>
	</dl>
</section>