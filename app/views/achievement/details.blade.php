<header class="itemHeader skinHeader">
	<div class="pageWidth">
		<img class="icon" width="64" height="64" src="{{ $achievement->getIconUrl(64) }}" alt="">
		<h2><div aria-hidden="true" class="overflow">{{ $achievement->getName() }}</div>{{ $achievement->getName() }}</h2>
		<nav class="notranslate">
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
		</nav>
		<div class="achievement__points">
			<span class="ap ap-32">{{ $achievement->getTotalPoints() }}</span>
		</div>
	</div>
</header>

<div class="itemDetails achievementDetails pageWidth">
	@if($achievement->achievement_category_id !== 0 && !is_null($achievement->category))
		<div class="achievement__breadcrumbs">
			<a href="{{ URL::route('achievement.overview', App::getLocale()) }}#{{ $achievement->category->group->id }}">
				{{ $achievement->category->group->getName() }}</a>
			/
			<a href="{{ URL::route('achievement.category', [App::getLocale(), $achievement->category->id]) }}">
				{{ $achievement->category->getName() }}</a>
		</div>
	@endif

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
								Chatlink::Encode(Chatlink::TYPE_ITEM, $bit->id)->chatlink
							}}</span></li>
						@endif
					@elseif($bit->type === 'Skin')
						@if(!is_null($bit->skin))
							<li class="achievement__objective--skin">{{ $bit->skin->link(32) }}</li>
						@else
							<li class="achievement__objective--text">Unknown skin <span class="chatlink--inline">{{
							Chatlink::Encode(Chatlink::TYPE_SKIN, $bit->id)->chatlink
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
			<li><span class="ap">{{ $tier->points }}</span>:
				{{ trans('achievement.tiers.objectivesCompleted', ['count' => number_format($tier->count, 0, '.', ' ')]) }}
		@endforeach
		</ol>
	@endif

	@if(!empty($rewards))
		<h3>{{ trans('achievement.rewards.header') }}</h3>
		<ul class="achievement__rewards itemList">
			@foreach($achievement->getData()->rewards as $reward)
				@if($reward->type === 'Item')
					<?php $rewardItem = Item::find($reward->id); ?>
					@if(!is_null($rewardItem))
						<li class="achievement__reward--item">{{
							$rewardItem->link(32, null, ($reward->count > 1 ? $reward->count.' × ' : '').$rewardItem->getName())
						}}</li>
					@else
						<li class="achievement__reward--unknown">Unknown item <span class="chatlink--inline">{{
							Chatlink::Encode(Chatlink::TYPE_ITEM, $reward->id)->chatlink
						}}</span></li>
					@endif
				@elseif($reward->type === 'Mastery')
					<li class="achievement__reward--mastery achievement__reward--mastery-{{$reward->region}}">{{
						trans('achievement.rewards.mastery', ['region' => $reward->region])
					}}</li>
				@endif
			@endforeach
		</ul>
	@endif
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
