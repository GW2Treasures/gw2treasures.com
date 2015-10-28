<header class="itemHeader skinHeader">
	<div class="pageWidth">
		<img class="icon" width="64" height="64" src="{{ $skin->getIconUrl(64) }}" alt="">
		<h2><div aria-hidden="true" class="overflow">{{ $skin->getName() }}</div>{{ $skin->getName() }}</h2>
		<nav class="notranslate">
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
		</nav>
	</div>
</header>

<div class="itemDetails pageWidth">
    <h3>{{ trans( 'skin.itemsUnlockingThisSkin' ) }}</h3>
    <ul class="itemList">
        @foreach( $skin->items as $item )
            <li>{{ $item->link(32) }}
        @endforeach
    </ul>
</div>
