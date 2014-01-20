<header class="itemHeader">
	<img class="icon" width="64" height="64" src="<?= $item->getIconUrl() ?>" alt="">
	<h2>{{ $item->getName( ) }}</h2>
	<nav>
		@if( App::getLocale() != 'de' )
			<div class="lang">[<span title="Deutsch"  class='langCode'>de</span>] <a rel="alternate" hreflang="de" href="{{ $item->getUrl('de') }}">{{ $item->getName( 'de' ) }}</a></div>
		@endif
		@if( App::getLocale() != 'en' )
			<div class="lang">[<span title="English"  class='langCode'>en</span>] <a rel="alternate" hreflang="en" href="{{ $item->getUrl('en') }}">{{ $item->getName( 'en' ) }}</a></div>
		@endif
		@if( App::getLocale() != 'es' )
			<div class="lang">[<span title="Español"  class='langCode'>es</span>] <a rel="alternate" hreflang="es" href="{{ $item->getUrl('es') }}">{{ $item->getName( 'es' ) }}</a></div>
		@endif
		@if( App::getLocale() != 'fr' )
			<div class="lang">[<span title="Français" class='langCode'>fr</span>] <a rel="alternate" hreflang="fr" href="{{ $item->getUrl('fr') }}">{{ $item->getName( 'fr' ) }}</a></div>
		@endif
	</nav>
</header>

<dl class="infobox">
	<dt>Chatlink</dt>
	<dd><input type="text" class="chatlink" readonly value="{{ e( $item->getChatLink() ) }}" /></dd>
	<dt>Wiki</dt>
	<dd>
		<a target="_blank" href="http://wiki-de.guildwars2.com/index.php?title=Spezial:Suche&amp;search={{ urlencode( $item->getName( 'de' ) ) }}">German</a>
		<a target="_blank" href="http://wiki.guildwars2.com/index.php?title=Special:Search&amp;search={{ urlencode( $item->getName( 'en' ) ) }}">English</a>
		<a target="_blank" href="http://wiki-es.guildwars2.com/index.php?title=Especial:Buscar&amp;search={{ urlencode( $item->getName( 'es' ) ) }}">Spanish</a>
		<a target="_blank" href="http://wiki-fr.guildwars2.com/index.php?title=Spécial:Recherche&amp;search={{ urlencode( $item->getName( 'fr' ) ) }}">French</a>
	</dd>
	<dt>Trading Post Info</dt>
	<dd>
		<a target="_blank" href="http://www.gw2spidy.com/item/{{ $item->id }}">Guild Wars 2 Spidy</a>
	</dd>
</dl>

@include( 'item.tooltip' )

@if( count( $craftedFrom = $item->recipes()->get() ) > 0 )
	<h3>{{ trans('item.craftedFrom') }}</h3>
	@foreach( $craftedFrom as $recipe )
		@include( 'recipe.box', array( 'recipe' => $recipe ) )
	@endforeach
@endif

@if( count( $usedInCrafting = $item->ingredientForRecipes()->get() ) > 0 )
	<h3>{{ trans('item.usedInCrafting') }}</h3><div>
	@foreach( $usedInCrafting as $recipe )
		@include( 'recipe.box', array( 'recipe' => $recipe ) )
	@endforeach
	</div>
@endif