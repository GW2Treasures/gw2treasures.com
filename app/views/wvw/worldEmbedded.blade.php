<!DOCTYPE html>
<html class="no-js">
<head>
	<title></title>
	<link rel="stylesheet" href="{{ Helper::cdn('assets/css/normalize.min.css') }}">
	<link rel="stylesheet" href="{{ Helper::cdn('assets/css/main.css') }}">
	@if( App::environment('production') )
		<link rel="stylesheet" href="{{ Helper::cdn('assets/css/style.css') }}">
	@else
		<link rel="stylesheet" href="//direct.darthmaim-cdn.de/gw2treasures/assets/css/style.css">
	@endif
</head>
<body style="min-width: 500px; min-height: 100px">
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
	@include( 'wvw.smallMatchBox', array( 'match' => $world->matches()->current()->withWorlds()->first(), 'homeworld' => $world, 'embedded' => true ))
</div>
</body>
</html>