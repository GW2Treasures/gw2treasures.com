<header class="itemHeader">
	<div class="pageWidth">
		<img class="icon" width="64" height="64" src="{{ $achievement->getIconUrl(64) }}" alt="">
		<h2>{{ $achievement->getName() }}</h2>
		<nav class="details__breadcrumb">
			<strong><a href="{{ route('achievement.overview', App::getLocale()) }}">{{ trans('header.achievements') }}</a></strong>

			@if($achievement->achievement_category_id !== 0 && !is_null($achievement->category))
				<svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
					<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
				</svg>
				<a href="{{ URL::route('achievement.overview', App::getLocale()) }}#{{ $achievement->category->group->id }}">
					{{ $achievement->category->group->getName() }}</a>

				<svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
					<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
				</svg>
				<a href="{{ URL::route('achievement.category', [App::getLocale(), $achievement->category->id]) }}">
					{{ $achievement->category->getName() }}</a>
			@endif
		</nav>
	</div>
</header>

<div class="itemDetails pageWidth">
	<div class="sidebar">
		@if( App::getLocale() != 'de' )
			<div class="lang"><span title="Deutsch"  class='langCode'>DE</span> <a rel="alternate" hreflang="de" href="{{ URL::route('achievement.details', array('de', $achievement->id)) }}">{{ $achievement->getName( 'de' ) }}</a></div>
		@endif
		@if( App::getLocale() != 'en' )
			<div class="lang"><span title="English"  class='langCode'>EN</span> <a rel="alternate" hreflang="en" href="{{ URL::route('achievement.details', array('en', $achievement->id)) }}">{{ $achievement->getName( 'en' ) }}</a></div>
		@endif
		@if( App::getLocale() != 'es' )
			<div class="lang"><span title="Español"  class='langCode'>ES</span> <a rel="alternate" hreflang="es" href="{{ URL::route('achievement.details', array('es', $achievement->id)) }}">{{ $achievement->getName( 'es' ) }}</a></div>
		@endif
		@if( App::getLocale() != 'fr' )
			<div class="lang"><span title="Français" class='langCode'>FR</span> <a rel="alternate" hreflang="fr" href="{{ URL::route('achievement.details', array('fr', $achievement->id)) }}">{{ $achievement->getName( 'fr' ) }}</a></div>
		@endif

		<h3>@lang('misc.share.header')</h3>
		<ul class="sidebar-share">
			<li class="twitter" ><a target="_blank" title="{{ trans('misc.share.twitter')  }}" data-dialog href="https://twitter.com/share?url={{ urlencode( $achievement->getUrl() ) }}&via=GW2Treasures&text={{ urlencode( $achievement->getName() ) }}"><i class="sprite-share-twitter">Twitter</i></a></li>
			<li class="google"  ><a target="_blank" title="{{ trans('misc.share.google')   }}" data-dialog href="https://plus.google.com/share?url={{ urlencode( $achievement->getUrl() ) }}"><i class="sprite-share-google">Google</i></a></li>
			<li class="facebook"><a target="_blank" title="{{ trans('misc.share.facebook') }}" data-dialog href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode( $achievement->getUrl() ) }}"><i class="sprite-share-facebook">Facebook</i></a></li>
			<li class="reddit"  ><a target="_blank" title="{{ trans('misc.share.reddit')   }}" href="https://www.reddit.com/submit?url={{ urlencode( (Request::secure() ? 'https://' : 'http://' ) . Config::get('app.domain') . route('achievement.details', ['language' => null, 'achievement' => $achievement->id], false) ) }}&title={{ $achievement->getName() }}"><i class="sprite-share-reddit">Reddit</i></a></li>
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

	<div class="achievementDetails">
		<p class="achievement__description">{{ $achievement->getData()->description }}</p>

		@if($achievement->getData()->requirement != '' || !empty($objectives))
			<h3>{{ trans_choice('achievement.objectives.header', !empty($objectives) ? count($objectives) : 1) }}</h3>
			@if($achievement->getData()->requirement != '')
				<p class="achievement__requirement">{{ $achievement->getData()->requirement }}</p>
			@endif
			@if(!empty($objectives))
				<ul class="achievement__objectives itemList">
					@foreach($objectives as $bit)
						@if($bit->type === 'Item')
							@if(!is_null($bit->item))
								<li class="achievement__objective--item">{{ $bit->item->link(32) }}</li>
							@else
								<li class="achievement__objective--text">Unknown item <span class="chatlink--inline">{{
									(new \GW2Treasures\GW2Tools\Chatlinks\ItemChatlink(\GW2Treasures\GW2Tools\Common\ItemStack::fromArray(['id' => $bit->id])))->encode();
								}}</span></li>
							@endif
						@elseif($bit->type === 'Skin')
							@if(!is_null($bit->skin))
								<li class="achievement__objective--skin">{{ $bit->skin->link(32) }}</li>
							@else
								<li class="achievement__objective--text">Unknown skin <span class="chatlink--inline">{{
									(new \GW2Treasures\GW2Tools\Chatlinks\SkinChatlink($bit->id))->encode();
								}}</span></li>
							@endif
						@elseif($bit->type === 'Minipet')
							<li class="achievement__objective--text">Collect unknown minipet</li>
						@elseif($bit->type === 'Text')
							<li class="achievement__objective--text">{{$bit->text}}</li>
						@endif
					@endforeach
				</ul>
			@endif
		@endif

		@if(count($achievement->getData()->tiers) > 0)
			<h3>{{ trans('achievement.tiers.header') }}</h3>
			<ol class="achievement__tiers">
			@foreach($achievement->getData()->tiers as $tier)
				<li><span class="ap-icon">{{ $tier->points }} @include('achievement.icon')</span>:
					{{ trans('achievement.tiers.objectivesCompleted', ['count' => number_format($tier->count, 0, '.', ' ')]) }}
			@endforeach
			</ol>
			<div class="achievement__tiers__total">
				{{ trans('achievement.tiers.total') }}: <span class="ap-icon">{{ $achievement->getTotalPoints() }} @include('achievement.icon')</span>
			</div>
		@endif

		@if(!empty($rewards))
			<h3>{{ trans('achievement.rewards.header') }}</h3>
			<ul class="achievement__rewards itemList">
				@foreach($rewards as $reward)
					@if($reward->type === 'Item')
						<?php $rewardItem = Item::find($reward->id); ?>
						@if(!is_null($rewardItem))
							<li class="achievement__reward--item">{{
								$rewardItem->link(32, null, ($reward->count > 1 ? $reward->count.'× ' : '').$rewardItem->getName())
							}}</li>
						@else
							<li class="achievement__reward--unknown">Unknown item <span class="chatlink--inline">{{
								(new \GW2Treasures\GW2Tools\Chatlinks\ItemChatlink(\GW2Treasures\GW2Tools\Common\ItemStack::fromArray(['id' => $reward->id])))->encode();
							}}</span></li>
						@endif
					@elseif($reward->type === 'Mastery')
						<li class="achievement__reward--mastery achievement__reward--mastery-{{$reward->region}}">{{
							trans('achievement.rewards.mastery', ['region' => $reward->region])
						}}</li>
					@elseif($reward->type === 'Coins')
						<li class="achievement__reward--coins"><img src="{{ Helper::cdn('icons/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316-64px.png') }}" width="32" height="32" style="margin-right: 5px">@include('item.vendorValue', ['vendorValue' => $reward->count])</li>
					@endif
				@endforeach
			</ul>
		@endif
	</div>
</div>

<script>
	[].slice.apply(document.getElementsByClassName('chatlink--inline')).forEach(function(chatlink) {
		chatlink.addEventListener('click', function(e) {
			if(e.metaKey) {
				location = '/search?q=' + window.encodeURIComponent(chatlink.innerHTML);
				return;
			}

			var range;
			if (document.selection) {
				range = document.body.createTextRange();
				range.moveToElementText(chatlink);
				range.select();
			} else if (window.getSelection) {
				range = document.createRange();
				range.selectNode(chatlink);
				window.getSelection().addRange(range);
			}
			if(document.execCommand('copy')) {
				chatlink.classList.add('chatlink--inline--copied');
				setTimeout(function() {
					chatlink.classList.remove('chatlink--inline--copied');
				}, 200);
			}
		});
	});
</script>
