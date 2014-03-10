<!DOCTYPE html>
<html class="no-js">
<head>
	<title>{{ $world->getName() }} | Embedded WvW World Stats | GW2 Treasures</title>
	<link rel="stylesheet" href="{{ Helper::cdn('assets/css/normalize.min.css') }}">
	<link rel="stylesheet" href="{{ Helper::cdn('assets/css/main.css') }}">
	@if( App::environment('production') )
		<link rel="stylesheet" href="{{ Helper::cdn('assets/css/style.css') }}">
	@else
		<link rel="stylesheet" href="//direct.darthmaim-cdn.de/gw2treasures/assets/css/style.css">
	@endif
</head>
<body class="{{ isset($_GET['style']) && in_array( $_GET['style'], array( 'light', 'dark' )) ? $_GET['style'] : 'light' }}" style="min-width: 500px; min-height: 100px">
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
@if( App::environment( 'production' ) && !isset( $_GET['notrack'] ))
	<!-- google analytics -->
	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', '{{ Config::get('app.trackingCode') }}', '{{ Config::get('app.domain') }}');
		ga('send', 'pageview');
	</script>
@endif
</body>
</html>