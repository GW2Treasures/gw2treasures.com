<header class="itemHeader">
	<div class="pageWidth">
		<img class="icon" width="64" height="64" src="{{ $skin->getIconUrl(64) }}" alt="">
		<h2 {{ isset($skin->getData()->rarity) ? 'class="color-'.$skin->getData()->rarity.'"' : '' }}><div aria-hidden="true" class="overflow">{{ $skin->getName() }}</div>{{ $skin->getName() }}</h2>
		<nav class="details__breadcrumb">
			<strong><a href="{{ route('skin', App::getLocale()) }}">{{ trans('skin.breadcrumb') }}</a></strong>
			<svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
				<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
			</svg> {{ trans('item.type.'.$skin->type) }}
			@if( isset($skin->getTypeData()->type) )
				<svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
					<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
				</svg> {{ trans( 'item.subtype.' . $skin->type . '.' . $skin->getTypeData()->type ) }}
			@endif
		</nav>
	</div>
</header>

<div class="itemDetails pageWidth">
	<div class="sidebar">
		@if( App::getLocale() != 'de' )
			<div class="lang"><span title="Deutsch"  class='langCode'>DE</span> <a rel="alternate" hreflang="de" href="{{ URL::route('skin.details', array('de', $skin->id)) }}">{{ $skin->getName( 'de' ) }}</a></div>
		@endif
		@if( App::getLocale() != 'en' )
			<div class="lang"><span title="English"  class='langCode'>EN</span> <a rel="alternate" hreflang="en" href="{{ URL::route('skin.details', array('en', $skin->id)) }}">{{ $skin->getName( 'en' ) }}</a></div>
		@endif
		@if( App::getLocale() != 'es' )
			<div class="lang"><span title="Español"  class='langCode'>ES</span> <a rel="alternate" hreflang="es" href="{{ URL::route('skin.details', array('es', $skin->id)) }}">{{ $skin->getName( 'es' ) }}</a></div>
		@endif
		@if( App::getLocale() != 'fr' )
			<div class="lang"><span title="Français" class='langCode'>FR</span> <a rel="alternate" hreflang="fr" href="{{ URL::route('skin.details', array('fr', $skin->id)) }}">{{ $skin->getName( 'fr' ) }}</a></div>
		@endif

		<h3>@lang('misc.share.header')</h3>
		<ul class="sidebar-share">
			<li class="chatlink">
				<input title="{{ trans('misc.share.chatlink') }}" readonly value="{{ e( $skin->getChatLink() ) }}" class="chatlink">
			</li>
			<li class="twitter" ><a target="_blank" title="{{ trans('misc.share.twitter')  }}" data-dialog href="https://twitter.com/share?url={{ urlencode( $skin->getUrl() ) }}&via=GW2Treasures&text={{ urlencode( $skin->getName() ) }}"><i class="sprite-share-twitter">Twitter</i></a></li>
			<li class="google"  ><a target="_blank" title="{{ trans('misc.share.google')   }}" data-dialog href="https://plus.google.com/share?url={{ urlencode( $skin->getUrl() ) }}"><i class="sprite-share-google">Google</i></a></li>
			<li class="facebook"><a target="_blank" title="{{ trans('misc.share.facebook') }}" data-dialog href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode( $skin->getUrl() ) }}"><i class="sprite-share-facebook">Facebook</i></a></li>
			<li class="reddit"  ><a target="_blank" title="{{ trans('misc.share.reddit')   }}" href="https://www.reddit.com/submit?url={{ urlencode( (Request::secure() ? 'https://' : 'http://' ) . Config::get('app.domain') . route('skin.details', ['language' => null, 'skin' => $skin->id], false) ) }}&title={{ $skin->getName() }}"><i class="sprite-share-reddit">Reddit</i></a></li>
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

    <h3 style="margin-top: 0;padding-top: 20px;">{{ trans( 'skin.itemsUnlockingThisSkin' ) }}</h3>
	@if(count($skin->items) > 0)
		<ul class="itemList">
			@foreach( $skin->items as $item )
				<li>{{ $item->link(32) }}
			@endforeach
		</ul>
	@else
		{{ trans('skin.noItemsUnlockingThisSkin') }}
	@endif

	<?php
		$achievementObjective = Achievement::requiresSkin($skin->id)->get();
		$achievementReward = Achievement::rewardsSkin($skin->id)->get();

		$achievementCount = count($achievementObjective) + count($achievementReward);
	?>

	@if($achievementCount > 0)
		<h3{{ $achievementCount >= 8 ? ' style="clear:both"' : '' }}>{{ trans('item.achievements.header') }}</h3>
	@endif
	@if(count($achievementObjective) > 0)
		<p>{{ trans('item.achievements.required') }}</p>
		<ul class="itemList">
			@foreach($achievementObjective as $achievement)
				<li>{{ $achievement->link(32) }}</li>
			@endforeach
		</ul>
	@endif
	@if(count($achievementReward) > 0)
		<p>{{ trans('item.achievements.reward') }}</p>
		<ul class="itemList">
			@foreach($achievementReward as $achievement)
				<li>{{ $achievement->link(32) }}</li>
			@endforeach
		</ul>
	@endif
</div>
