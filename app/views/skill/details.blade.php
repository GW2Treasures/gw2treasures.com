<header class="itemHeader">
    <div class="pageWidth">
        <img class="icon" width="64" height="64" src="{{ $skill->getIconUrl(64) }}" alt="">
        <h2>{{ $skill->getName() }}</h2>
        <nav class="details__breadcrumb">
            <strong><a href="{{ route('skill.overview', App::getLocale()) }}">{{ trans('skill.breadcrumb') }}</a></strong>
        </nav>
    </div>
</header>

<div class="itemDetails pageWidth">
    <div class="sidebar">
        @if( App::getLocale() != 'de' )
            <div class="lang"><span title="Deutsch"  class='langCode'>DE</span> {{ $skill->link(null, 'de', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'en' )
            <div class="lang"><span title="English"  class='langCode'>EN</span> {{ $skill->link(null, 'en', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'es' )
            <div class="lang"><span title="Español"  class='langCode'>ES</span> {{ $skill->link(null, 'es', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'fr' )
            <div class="lang"><span title="Français" class='langCode'>FR</span> {{ $skill->link(null, 'fr', null, null, ['rel' => 'alternate']) }}</div>
        @endif

        <h3>@lang('misc.wiki.header')</h3>
        <ul class="sidebar-wikis">
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki-de.guildwars2.com/index.php?title=Spezial:Suche&amp;search={{ urlencode( $skill->getName( 'de' ) ) }}">@lang('misc.wiki.german')</a></li>
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki.guildwars2.com/index.php?title=Special:Search&amp;search={{ urlencode( $skill->getChatLink() ) }}">@lang('misc.wiki.english')</a></li>
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki-es.guildwars2.com/index.php?title=Especial:Buscar&amp;search={{ urlencode( $skill->getName( 'es' ) ) }}">@lang('misc.wiki.spanish')</a></li>
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki-fr.guildwars2.com/index.php?title=Spécial:Recherche&amp;search={{ urlencode( $skill->getName( 'fr' ) ) }}">@lang('misc.wiki.french')</a></li>
        </ul>

        <h3>@lang('misc.share.header')</h3>
        <ul class="sidebar-share">
            <li class="chatlink">
                <input title="{{ trans('misc.share.chatlink') }}" readonly value="{{ e( $skill->getChatLink() ) }}" class="chatlink">
            </li>
            <li class="twitter" ><a target="_blank" title="{{ trans('misc.share.twitter')  }}" data-dialog href="https://twitter.com/share?url={{ urlencode( $skill->getUrl() ) }}&via=GW2Treasures&text={{ urlencode( $skill->getName() ) }}"><i class="sprite-share-twitter">Twitter</i></a></li>
            <li class="google"  ><a target="_blank" title="{{ trans('misc.share.google')   }}" data-dialog href="https://plus.google.com/share?url={{ urlencode( $skill->getUrl() ) }}"><i class="sprite-share-google">Google</i></a></li>
            <li class="facebook"><a target="_blank" title="{{ trans('misc.share.facebook') }}" data-dialog href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode( $skill->getUrl() ) }}"><i class="sprite-share-facebook">Facebook</i></a></li>
            <li class="reddit"  ><a target="_blank" title="{{ trans('misc.share.reddit')   }}" href="https://www.reddit.com/submit?url={{ urlencode( (Request::secure() ? 'https://' : 'http://' ) . Config::get('app.domain') . route('skill.details', ['language' => null, 'skill' => $skill->id], false) ) }}&title={{ $skill->getName() }}"><i class="sprite-share-reddit">Reddit</i></a></li>
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

    <div class="skillDetails">
        @include('skill.tooltip')
    </div>

    @if(count($skill->requiresTraits) > 0)
        <h3>Affected by Traits</h3>
        <ul class="itemList">
            @foreach($skill->requiresTraits as $requiredFor)
                <li>{{ $requiredFor->link(32) }}</li>
            @endforeach
        </ul>
    @endif
</div>

<style>.skillDetails > .tooltip {
    border: none; box-shadow: none; padding: 0;
} .skillDetails > .tooltip:nth-of-type(1) > header {
    display: none;
}</style>
