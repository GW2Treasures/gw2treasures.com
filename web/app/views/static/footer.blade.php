<footer id="footer" class="clearfix">
	<nav role="navigation" class="pageWidth grid footerGrid">
		<div class="row">
			<div class="column4">
				<a href="{{ URL::route('search', App::getLocale()) }}">{{ trans('footer.items') }}</a>
				<ul>
					<li><a href="{{ URL::route('stats.items.new', App::getLocale()) }}">{{ trans('footer.recentlyAddedItems') }}</a>
					<li><a href="{{ URL::route('randomitem', App::getLocale()) }}" accesskey="x">{{ trans('footer.randomItem') }}</a>
					<li><a href="{{ URL::route('search', App::getLocale()) }}">{{ trans('footer.search') }}</a>
				</ul>
				<a href="{{ URL::route('skin', App::getLocale()) }}">{{ trans('footer.skins') }}</a>
				<ul>
					<li><a href="{{ URL::route('skin', App::getLocale()) }}">{{ trans('footer.skinOverview') }}</a>
				</ul>
			</div>
			<div class="column4">
				<a href="{{ URL::route('achievement.overview', App::getLocale()) }}" accesskey="a">{{ trans('footer.achievements.header') }}</a>
				<ul>
					<li><a href="{{ URL::route('achievement.overview', App::getLocale()) }}">{{ trans('footer.achievements.overview') }}</a>
					<li><a href="{{ URL::route('achievement.overview', App::getLocale()) }}">{{ trans('footer.achievements.daily') }}</a>
				</ul>
				<a href="{{ URL::route('wvw', App::getLocale()) }}">{{ trans('footer.wvw') }}</a>
				<ul>
					<li><a href="{{ URL::route('wvw', App::getLocale()) }}">{{ trans('footer.wvwOverview') }}</a>
					<li><a href="{{ URL::route('dev.embedWorldStats') }}">{{ trans('footer.wvwWidget') }}</a>
				</ul>
			</div>
			<div class="column4">
				<a href="{{ URL::route('about', App::getLocale()) }}">{{ trans('footer.about') }}</a>
				<ul>
					<li><a href="https://github.com/GW2Treasures/gw2treasures.com" target="_blank">{{ trans('footer.sourcecode') }}</a>
					<li><a href="https://github.com/GW2Treasures/gw2treasures.com/issues" target="_blank">{{ trans('footer.bugtracker') }}</a>
					<li><a href="{{ URL::route('contact', App::getLocale()) }}">{{ trans('footer.contact') }}</a>
				</ul>
				<a href="{{ URL::route('dev') }}" class="">{{ trans('footer.developer') }}</a>
				<ul>
					<li><a href="{{ URL::route('dev') }}#apiDoc">{{ trans('footer.APIDocumentation') }}</a>
				</ul>
			</div>
			<div class="column4">
				{{ trans('footer.language') }}
				<ul>
					<li><a hreflang="de" rel="alternate" href="//de.{{ Config::get('app.domain') . Request::getRequestUri() }}">{{ trans('footer.german') }}</a>
					<li><a hreflang="en" rel="alternate" href="//en.{{ Config::get('app.domain') . Request::getRequestUri() }}">{{ trans('footer.english') }}</a>
					<li><a hreflang="es" rel="alternate" href="//es.{{ Config::get('app.domain') . Request::getRequestUri() }}">{{ trans('footer.spanish') }}</a>
					<li><a hreflang="fr" rel="alternate" href="//fr.{{ Config::get('app.domain') . Request::getRequestUri() }}">{{ trans('footer.french') }}</a>
				</ul>
			</div>
		</div>
	</nav>

	<p class="pageWidth legalNotice" role="contentinfo">{{ trans('footer.legalNotice1') }}</p>
	<p class="pageWidth legalNotice" role="contentinfo">{{ trans('footer.legalNotice2') }}</p>
	<div class="pageWidth legalNotice" style="margin-top: 2em">
		<span style="float:right" title="<?php
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
            generated @ {{ date(DATE_RFC822) }}
		</span>
	</div>

	@if( isset($_GET['debug']) && !App::environment('production') )
		<pre class="pageWidth">
			{{ print_r(DB::getQueryLog()) }}
		</pre>
	@endif
</footer>
