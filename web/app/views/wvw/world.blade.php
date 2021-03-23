<header class="itemHeader">
	<div class="pageWidth" style="padding-left: 20px;">
		<h2>{{ $world->getName() }}</h2>
		<nav class="details__breadcrumb">
			<strong><a href="{{ route('wvw', App::getLocale()) }}">{{ trans('wvw.breadcrumb') }}</a></strong>
			<svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
				<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
			</svg> {{ $world->id >= 2000 ? trans('wvw.region.eu') : trans('wvw.region.na') }}
		</nav>
	</div>
</header>

<div class="itemDetails pageWidth">
	<div class="sidebar">
		@if( App::getLocale() != 'de' )
			<div class="lang"><span title="Deutsch"  class='langCode'>DE</span> <a rel="alternate" hreflang="de" href="{{ route('wvw.world', ['de', $world->id]) }}">{{ $world->getName( 'de' ) }}</a></div>
		@endif
		@if( App::getLocale() != 'en' )
			<div class="lang"><span title="English"  class='langCode'>EN</span> <a rel="alternate" hreflang="en" href="{{ route('wvw.world', ['en', $world->id]) }}">{{ $world->getName( 'en' ) }}</a></div>
		@endif
		@if( App::getLocale() != 'es' )
			<div class="lang"><span title="Español"  class='langCode'>ES</span> <a rel="alternate" hreflang="es" href="{{ route('wvw.world', ['es', $world->id]) }}">{{ $world->getName( 'es' ) }}</a></div>
		@endif
		@if( App::getLocale() != 'fr' )
			<div class="lang"><span title="Français" class='langCode'>FR</span> <a rel="alternate" hreflang="fr" href="{{ route('wvw.world', ['fr', $world->id]) }}">{{ $world->getName( 'fr' ) }}</a></div>
		@endif

		<h3>@lang('misc.share.header')</h3>
		<ul class="sidebar-share">
			<li class="twitter" ><a target="_blank" title="{{ trans('misc.share.twitter')  }}" data-dialog href="https://twitter.com/share?url={{ urlencode( $world->getUrl() ) }}&via=GW2Treasures&text={{ urlencode( $world->getName() ) }}"><i class="sprite-share-twitter">Twitter</i></a></li>
			<li class="google"  ><a target="_blank" title="{{ trans('misc.share.google')   }}" data-dialog href="https://plus.google.com/share?url={{ urlencode( $world->getUrl() ) }}"><i class="sprite-share-google">Google</i></a></li>
			<li class="facebook"><a target="_blank" title="{{ trans('misc.share.facebook') }}" data-dialog href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode( $world->getUrl() ) }}"><i class="sprite-share-facebook">Facebook</i></a></li>
			<li class="reddit"  ><a target="_blank" title="{{ trans('misc.share.reddit')   }}" href="https://www.reddit.com/submit?url={{ urlencode( (Request::secure() ? 'https://' : 'http://' ) . Config::get('app.domain') . route('wvw.world', ['language' => null, 'skin' => $world->id], false) ) }}&title={{ $world->getName() }}"><i class="sprite-share-reddit">Reddit</i></a></li>
		</ul>
		<script>
			document.addEventListener("DOMContentLoaded", function() {
				$('.sidebar-share a[data-dialog]').on('click', function(e) {
					window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600');

					e.preventDefault();
					return false;
				});
			});
		</script>
	</div>

	<h2 style="clear: right;">{{ trans('wvw.currentMatchup') }}</h2>
	<?php $match = $world->matches()->current()->first(); ?>
	@if(!is_null($match))
		<table class="wvw-table">
			@include('wvw.head')
			<tbody>
			@include( 'wvw.smallMatchBox', ['homeworld' => $world])
			</tbody>
		</table>
	@else
		<p>{{ trans('wvw.noCurrentMatchup', ['world' => $world->getName()]) }}</p>
	@endif

	<p style="margin-top: 2em; font-size: 11px">
		Embedding: <code>{{ URL::route( 'wvw.world.embedded', array( App::getLocale(), $world->id )) }}</code> (<a href="{{ URL::route('dev.embedWorldStats') }}">Info</a>)
	</p>
</div>
