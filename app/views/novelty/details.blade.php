<?php /** @var Novelty $novelty */ ?>
<header class="itemHeader">
    <div class="pageWidth">
        <img class="icon" width="64" height="64" src="{{ $novelty->getIconUrl(64) }}" alt="">
        <h2>{{ $novelty->getName() }}</h2>
        @include('helper.breadcrumbs', ['breadcrumbs' => [
            [trans('novelty.breadcrumb'), route('novelty.overview', App::getLocale())],
            [trans('novelty.slot.'.$novelty->slot), route('novelty.overview', App::getLocale()).'#'.$novelty->slot],
            [$novelty->getName(), $novelty->getUrl()]
        ]])
    </div>
</header>

<div class="itemDetails pageWidth">
    <div class="sidebar">
        @if( App::getLocale() != 'de' )
            <div class="lang"><span title="Deutsch"  class='langCode'>DE</span> {{ $novelty->link(null, 'de', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'en' )
            <div class="lang"><span title="English"  class='langCode'>EN</span> {{ $novelty->link(null, 'en', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'es' )
            <div class="lang"><span title="Español"  class='langCode'>ES</span> {{ $novelty->link(null, 'es', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'fr' )
            <div class="lang"><span title="Français" class='langCode'>FR</span> {{ $novelty->link(null, 'fr', null, null, ['rel' => 'alternate']) }}</div>
        @endif

        @if($novelty->unlocks !== null)
            <h3>{{ trans('novelty.unlockStats.header') }}</h3>
            <p>{{ trans('novelty.unlockStats.text', [
                'unlocks' => '<strong>'.round($novelty->unlocks * 100, 2).'%</strong>',
                'gw2e' => '<a href="https://gw2efficiency.com/account/unlock-statistics?filter.key=novelties" rel="noreferrer noopener" target="_blank">gw2efficiency.com</a>'
            ]) }}</p>
        @endif

        <h3>@lang('misc.wiki.header')</h3>
        <ul class="sidebar-wikis">
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki-de.guildwars2.com/index.php?title=Spezial:Suche&amp;search={{ urlencode( $novelty->getName( 'de' ) ) }}">@lang('misc.wiki.german')</a></li>
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki.guildwars2.com/index.php?title=Special:Search&amp;search={{ urlencode( $novelty->getName( 'en' ) ) }}">@lang('misc.wiki.english')</a></li>
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki-es.guildwars2.com/index.php?title=Especial:Buscar&amp;search={{ urlencode( $novelty->getName( 'es' ) ) }}">@lang('misc.wiki.spanish')</a></li>
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki-fr.guildwars2.com/index.php?title=Spécial:Recherche&amp;search={{ urlencode( $novelty->getName( 'fr' ) ) }}">@lang('misc.wiki.french')</a></li>
        </ul>

        <h3>@lang('misc.share.header')</h3>
        <ul class="sidebar-share">
            <li class="twitter" ><a target="_blank" title="{{ trans('misc.share.twitter')  }}" data-dialog href="https://twitter.com/share?url={{ urlencode( $novelty->getUrl() ) }}&via=GW2Treasures&text={{ urlencode( $novelty->getName() ) }}"><i class="sprite-share-twitter">Twitter</i></a></li>
            <li class="google"  ><a target="_blank" title="{{ trans('misc.share.google')   }}" data-dialog href="https://plus.google.com/share?url={{ urlencode( $novelty->getUrl() ) }}"><i class="sprite-share-google">Google</i></a></li>
            <li class="facebook"><a target="_blank" title="{{ trans('misc.share.facebook') }}" data-dialog href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode( $novelty->getUrl() ) }}"><i class="sprite-share-facebook">Facebook</i></a></li>
            <li class="reddit"  ><a target="_blank" title="{{ trans('misc.share.reddit')   }}" href="https://www.reddit.com/submit?url={{ urlencode( (Request::secure() ? 'https://' : 'http://' ) . Config::get('app.domain') . route('novelty.details', ['language' => null, 'novelty' => $novelty->id], false) ) }}&title={{ $novelty->getName() }}"><i class="sprite-share-reddit">Reddit</i></a></li>
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

    <div style="padding-top: 20px">
        <p class="achievement__description">{{ $novelty->getDescription() }}</p>

        <h3>@lang('novelty.items')</h3>
        <ul class="itemList">
            @foreach($novelty->unlockItems()->get() as $item)
                <li>{{ $item->link(32) }}</li>
            @endforeach
        </ul>
    </div>
</div>
