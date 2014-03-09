<h2>{{ $world->getName() }}</h2>

<div class="matchList">
	<div class="matchListHeader clearfix">
		<span class="world">{{ trans('wvw.world') }}</span>
		<span class="score">{{ trans('wvw.score') }}</span>
		<span class="income">{{ trans('wvw.income') }}</span>
		<span class="objectives">
			<span><i class="sprite-20-camp-gray"></i></span>
			<span><i class="sprite-20-tower-gray"></i></span>
			<span><i class="sprite-20-keep-gray"></i></span>
			<span><i class="sprite-20-castle-gray"></i></span>
		</span>
	</div>
	@include( 'wvw.smallMatchBox', array( 'match' => $world->matches()->current()->withWorlds()->first(), 'homeworld' => $world ))
</div>

<p style="margin-top: 2em; font-size: 10px">
Embedding: <code>{{ URL::route( 'wvw.world.embedded', array( App::getLocale(), $world->id )) }}</code>
</p>