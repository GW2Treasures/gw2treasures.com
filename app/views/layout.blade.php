<!DOCTYPE html>
<!--[if lt IE 7]>      <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="{{ App::getLocale() }}" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="{{ App::getLocale() }}" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="{{ App::getLocale() }}" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="{{ App::getLocale() }}" class="no-js"> <!--<![endif]-->
<head>
	<meta charset="utf-8">
	<!--<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">-->
	<title>{{ $title }} | GW2 Treasures</title>
	<meta name="description" content="">
	<!--<meta name="viewport" content="width=device-width">-->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">

	<link rel="stylesheet" href="{{ Helper::cdn('assets/css/normalize.min.css') }}">
	<link rel="stylesheet" href="{{ Helper::cdn('assets/css/main.css') }}">
	<!--<link rel="stylesheet" href="{{ Helper::cdn('assets/css/style.css') }}">-->
	<link rel="stylesheet" href="//direct.darthmaim-cdn.de/gw2treasures/assets/css/style.css">

	<link href='http://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:400,300,700|Open+Sans:400,300,600,700|Open+Sans+Condensed:300|Droid+Sans+Mono|Droid+Serif' rel='stylesheet' type='text/css'>

	<link rel="icon" href="{{ Helper::cdn('assets/img/favicon.png') }}" type="image/png" />
	<link rel="shortcut icon" href="/favicon.ico" />

	<script src="{{ Helper::cdn('assets/js/vendor/modernizr-2.6.2.min.js') }}"></script>

	<!-- alternate versions in different languages -->
	<link rel="alternate" hreflang="x-default" href="//{{    Config::get('app.domain') . Request::getRequestUri() }}" />
	<link rel="alternate" hreflang="de"        href="//de.{{ Config::get('app.domain') . Request::getRequestUri() }}" />
	<link rel="alternate" hreflang="en"        href="//en.{{ Config::get('app.domain') . Request::getRequestUri() }}" />
	<link rel="alternate" hreflang="es"        href="//es.{{ Config::get('app.domain') . Request::getRequestUri() }}" />
	<link rel="alternate" hreflang="fr"        href="//fr.{{ Config::get('app.domain') . Request::getRequestUri() }}" />
</head>
<body>
	<div id="wrapper">
		<header id="header" class="clearfix">
			<div class="pageWidth">
				<h1 class="floatLeft">GW2 Treasures</h1>
				{{ Form::open( array( 'method' => 'GET', 'route' => array('search', App::getLocale() )) ) }}
					{{ Form::text( 'q', null, array('placeholder' => 'Search' )) }}
				{{ Form::close() }}
			</div>
		</header>


		<ul id="notifications">
			@foreach( Notification::Notifications() as $n )
				@include( 'notification', array( 'notification' => $n ) )
			@endforeach
		</ul>

		<div id="content">
			<div class="pageWidth">{{ $content }}</div>
		</div>

		<footer id="footerBar"><div class="pageWidth"><a href='#'>darthmaim</a> &copy; 2014</div></footer>
	</div>

	<footer id="footer" class="clearfix">
		<nav><ul id="footerList" class="pageWidth">
			<li><a href="#">{{ trans('footer.itemlists') }}</a>
				<ul>
					<li><a href="#">{{ trans('footer.recentlyAddedItems') }}</a>
					<li><a href="#">{{ trans('footer.recentlyChangedItems') }}</a>
					<li><a href="#">{{ trans('footer.weaponSets') }}</a>
					<li><a href="#">{{ trans('footer.armorSets') }}</a>
				</ul>
			<li><a href="#">{{ trans('footer.RSSFeeds') }}</a>
				<ul>
					<li><a href="#">{{ trans('footer.newItems') }}</a>
					<li><a href="#">{{ trans('footer.changedItems') }}</a>
				</ul>
			<li><a href="#">{{ trans('footer.developer') }}</a>
				<ul>
					<li><a href="#">{{ trans('footer.APIDocumentation') }}</a>
				</ul>
			<li><a href="#">{{ trans('footer.about') }}</a>
				<ul>
					<li><a href="#">{{ trans('footer.statistics') }}</a>
					<li><a href="#">{{ trans('footer.changelog') }}</a>
					<li><a href="#">{{ trans('footer.terms') }}</a>
					<li><a href="#">{{ trans('footer.contact') }}</a>
				</ul>
			<li>{{ trans('footer.language') }}
				<ul>
					<li><a hreflang="de" rel="alternate" href="//de.{{ Config::get('app.domain') . Request::getRequestUri() }}">{{ trans('footer.german') }}</a>
					<li><a hreflang="en" rel="alternate" href="//en.{{ Config::get('app.domain') . Request::getRequestUri() }}">{{ trans('footer.english') }}</a>
					<li><a hreflang="es" rel="alternate" href="//es.{{ Config::get('app.domain') . Request::getRequestUri() }}">{{ trans('footer.spanish') }}</a>
					<li><a hreflang="fr" rel="alternate" href="//fr.{{ Config::get('app.domain') . Request::getRequestUri() }}">{{ trans('footer.french') }}</a>
				</ul>
		</ul></nav>
		<p class="pageWidth legalNotice">{{ trans('footer.legalNotice1') }}</p>
		<p class="pageWidth legalNotice">{{ trans('footer.legalNotice2') }}</p>
		<p class="pageWidth legalNotice" style="text-align: right; margin-top: 2em">
			<span title="<?php 
				echo 'Runtime: ' . round(( STARTTIME + microtime( true ) ) * 1000, 2 ) . 'ms' . "\n";
				echo 'Memory usage: ' . round(memory_get_usage() / 1024 / 1024, 2) . ' MiB' . "\n";
				echo 'DB queries: ' . count(DB::getQueryLog()) . "\n";
				if( isset( $cached ) && $cached ) {
					echo 'cached' . "\n";
				}
				if( isset( $_SERVER['HTTP_CF_CONNECTING_IP'] )) {
					echo 'via cloudflare';
				}
			?>">
				generated @ <?= date(DATE_RFC822) ?>
			</span>
		</p>

		@if( isset($_GET['debug']) )
			<pre class="pageWidth">
				{{ dd(DB::getQueryLog()) }}
			</pre>
		@endif
	</footer>
	</div>
	<div id="scripts">
		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', '{{ Config::get('app.trackingCode') }}', '{{ Config::get('app.domain') }}');
			ga('send', 'pageview');
		</script>
		<script>
		function outbound(a){ga('send','event','Outbound Links','click',a.href)}
		</script>
	</div>
</body>
</html>
