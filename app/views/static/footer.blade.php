<footer id="footer" class="clearfix">
	<nav role="navigation" class="pageWidth grid footerGrid">
		<div class="row">
			<div class="column4">
				<a href="{{ URL::route('search', App::getLocale()) }}">{{ trans('footer.items') }}</a>
				<ul>
					<li><a href="#">{{ trans('footer.recentlyAddedItems') }}</a>
					<li><a href="#">{{ trans('footer.recentlyChangedItems') }}</a>
					<li><a href="#">{{ trans('footer.weaponSets') }}</a>
					<li><a href="#">{{ trans('footer.armorSets') }}</a>
					<li><a href="{{ URL::route('randomitem', App::getLocale()) }}">{{ trans('footer.randomItem') }}</a>
				</ul>
				<a href="{{ URL::route('wvw', App::getLocale()) }}">{{ trans('footer.wvw') }}</a>
				<ul>
					<li><a href="{{ URL::route('wvw', App::getLocale()) }}">{{ trans('footer.wvwOverview') }}</a>
				</ul>
			</div>
			<div class="column4">
				{{ trans('footer.RSSFeeds') }}
				<ul>
					<li><a href="#">{{ trans('footer.newItems') }}</a>
					<li><a href="#">{{ trans('footer.changedItems') }}</a>
				</ul>
				<a href="{{ URL::route('dev') }}" class="">{{ trans('footer.developer') }}</a>
				<ul>
                    <li><a href="{{ URL::route('dev') }}#apiDoc">{{ trans('footer.APIDocumentation') }}</a>
				</ul>
			</div>
			<div class="column4">
				<a href="{{ URL::route('about', App::getLocale()) }}">{{ trans('footer.about') }}</a>
				<ul>
					<li><a href="#">{{ trans('footer.statistics') }}</a>
					<li><a href="#">{{ trans('footer.changelog') }}</a>
					<li><a href="#">{{ trans('footer.terms') }}</a>
					<li><a href="https://github.com/darthmaim/gw2treasures-webinterface/issues">{{ trans('footer.bugtracker') }}</a>
					<li><a href="{{ URL::route('contact', App::getLocale()) }}">{{ trans('footer.contact') }}</a>
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
			generated @ <?= date(DATE_RFC822) ?>
		</span>
	</div>

	@if( isset($_GET['debug']) && !App::environment('production') )
		<pre class="pageWidth">
			{{ print_r(DB::getQueryLog()) }}
		</pre>
	@endif
</footer>
