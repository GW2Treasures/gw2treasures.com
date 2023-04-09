<?php /** @var GuildUpgrade $upgrade */ ?>
<header class="itemHeader">
    <div class="pageWidth">
        <img class="icon" width="64" height="64" src="{{ $upgrade->getIconUrl(64) }}" alt="">
        <h2>{{ $upgrade->getName() }}</h2>
        @include('helper.breadcrumbs', ['breadcrumbs' => [
            [trans('guild.breadcrumb')],
            [trans('guild.upgrade.breadcrumb'), route('guild.upgrade.overview', App::getLocale())],
            [trans('guild.upgrade.type.'.$upgrade->type), route('guild.upgrade.overview', App::getLocale()).'#'.$upgrade->type],
            [$upgrade->getName(), $upgrade->getUrl()]
        ]])
    </div>
</header>

<div class="itemDetails pageWidth clearfix">
    <div class="sidebar">
        @if( App::getLocale() != 'de' )
            <div class="lang"><span title="Deutsch"  class='langCode'>DE</span> {{ $upgrade->link(null, 'de', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'en' )
            <div class="lang"><span title="English"  class='langCode'>EN</span> {{ $upgrade->link(null, 'en', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'es' )
            <div class="lang"><span title="Español"  class='langCode'>ES</span> {{ $upgrade->link(null, 'es', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'fr' )
            <div class="lang"><span title="Français" class='langCode'>FR</span> {{ $upgrade->link(null, 'fr', null, null, ['rel' => 'alternate']) }}</div>
        @endif

        <h3>@lang('misc.wiki.header')</h3>
        <ul class="sidebar-wikis">
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki-de.guildwars2.com/index.php?title=Spezial:Suche&amp;search={{ urlencode( $upgrade->getName( 'de' ) ) }}">@lang('misc.wiki.german')</a></li>
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki.guildwars2.com/index.php?title=Special:Search&amp;search={{ urlencode( $upgrade->getName( 'en' ) ) }}">@lang('misc.wiki.english')</a></li>
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki-es.guildwars2.com/index.php?title=Especial:Buscar&amp;search={{ urlencode( $upgrade->getName( 'es' ) ) }}">@lang('misc.wiki.spanish')</a></li>
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki-fr.guildwars2.com/index.php?title=Spécial:Recherche&amp;search={{ urlencode( $upgrade->getName( 'fr' ) ) }}">@lang('misc.wiki.french')</a></li>
        </ul>

        <h3>@lang('misc.share.header')</h3>
        <ul class="sidebar-share">
            <li class="twitter" ><a target="_blank" title="{{ trans('misc.share.twitter')  }}" data-dialog href="https://twitter.com/share?url={{ urlencode( $upgrade->getUrl() ) }}&via=GW2Treasures&text={{ urlencode( $upgrade->getName() ) }}"><i class="sprite-share-twitter">Twitter</i></a></li>
            <li class="google"  ><a target="_blank" title="{{ trans('misc.share.google')   }}" data-dialog href="https://plus.google.com/share?url={{ urlencode( $upgrade->getUrl() ) }}"><i class="sprite-share-google">Google</i></a></li>
            <li class="facebook"><a target="_blank" title="{{ trans('misc.share.facebook') }}" data-dialog href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode( $upgrade->getUrl() ) }}"><i class="sprite-share-facebook">Facebook</i></a></li>
            <li class="reddit"  ><a target="_blank" title="{{ trans('misc.share.reddit')   }}" href="https://www.reddit.com/submit?url={{ urlencode( (Request::secure() ? 'https://' : 'http://' ) . Config::get('app.domain') . route('guild.upgrade.details', ['language' => null, 'novupgradeelty' => $upgrade->id], false) ) }}&title={{ $upgrade->getName() }}"><i class="sprite-share-reddit">Reddit</i></a></li>
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

    <p class="achievement__description" style="padding-top: 20px">{{ $upgrade->getDescription() }}</p>

    @if(count($upgrade->getData()->costs))
        <h3>@lang('guild.upgrade.cost')</h3>
        <ul class="itemList">
            @foreach($upgrade->getData()->costs as $cost)
                @if($cost->type === 'Coins')
                    <li class="achievement__reward--coins">
                        <img src="https://icons-gw2.darthmaim-cdn.com/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316-64px.png" width="32" height="32" style="margin-right: .5em">@include('item.vendorValue', ['vendorValue' => $cost->count])
                    </li>
                @elseif(isset($cost->item_id))
                    @if(isset($items[$cost->item_id]))
                        <li>{{ $items[$cost->item_id]->link(32, null, $cost->count.'× '.$items[$cost->item_id]->getName()) }}</li>
                    @else
                        <li>Unknown item {{ $cost->item_id }}</li>
                    @endif
                @else
                    <li class="guild-upgrade__cost-placeholder">{{ $cost->count }}× {{ $cost->name }}</li>
                @endif
            @endforeach
        </ul>
    @endif
</div>

<style>
    .guild-upgrade__cost-placeholder::before {
        content: '';
        display: inline-block;
        background: #eee;
        width: 32px;
        height: 32px;
        margin-right: 0.5em;
        vertical-align: top;   
    }
</style>
