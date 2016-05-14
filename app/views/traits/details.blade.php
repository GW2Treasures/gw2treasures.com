<header class="itemHeader">
    <div class="pageWidth">
        <img class="icon" width="64" height="64" src="{{ $trait->getIconUrl(64) }}" alt="">
        <h2><div aria-hidden="true" class="overflow">{{ $trait->getName() }}</div>{{ $trait->getName() }}</h2>
        <nav class="details__breadcrumb">
            <strong><a href="{{ route('trait.overview', App::getLocale()) }}">{{ trans('trait.breadcrumb') }}</a></strong>
            <svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
            {{ $trait->specialization->profession->link(null) }}
            <svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
            {{ $trait->specialization->link(null) }}
            <svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
            {{ trans('trait.slot.'.$trait->slot) }}
        </nav>
    </div>
</header>

<div class="itemDetails pageWidth">
    <div class="sidebar">
        @if( App::getLocale() != 'de' )
            <div class="lang"><span title="Deutsch"  class='langCode'>DE</span> {{ $trait->link(null, 'de', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'en' )
            <div class="lang"><span title="English"  class='langCode'>EN</span> {{ $trait->link(null, 'en', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'es' )
            <div class="lang"><span title="Español"  class='langCode'>ES</span> {{ $trait->link(null, 'es', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'fr' )
            <div class="lang"><span title="Français" class='langCode'>FR</span> {{ $trait->link(null, 'fr', null, null, ['rel' => 'alternate']) }}</div>
        @endif

        <h3>@lang('misc.share.header')</h3>
        <ul class="sidebar-share">
            <li class="chatlink">
                <input title="{{ trans('misc.share.chatlink') }}" readonly value="{{ e( $trait->getChatLink() ) }}" class="chatlink">
            </li>
            <li class="twitter" ><a target="_blank" title="{{ trans('misc.share.twitter')  }}" data-dialog href="https://twitter.com/share?url={{ urlencode( $trait->getUrl() ) }}&via=GW2Treasures&text={{ urlencode( $trait->getName() ) }}"><i class="sprite-share-twitter">Twitter</i></a></li>
            <li class="google"  ><a target="_blank" title="{{ trans('misc.share.google')   }}" data-dialog href="https://plus.google.com/share?url={{ urlencode( $trait->getUrl() ) }}"><i class="sprite-share-google">Google</i></a></li>
            <li class="facebook"><a target="_blank" title="{{ trans('misc.share.facebook') }}" data-dialog href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode( $trait->getUrl() ) }}"><i class="sprite-share-facebook">Facebook</i></a></li>
            <li class="reddit"  ><a target="_blank" title="{{ trans('misc.share.reddit')   }}" href="https://www.reddit.com/submit?url={{ urlencode( (Request::secure() ? 'https://' : 'http://' ) . Config::get('app.domain') . route('trait.details', ['language' => null, 'trait' => $trait->id], false) ) }}&title={{ $trait->getName() }}"><i class="sprite-share-reddit">Reddit</i></a></li>
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

    <div class="traitDetails">
        @include('traits.tooltip')

        @if(count($trait->requiredForTraits) > 0)
            <h3>Affects Traits</h3>
            <ul class="itemList">
                @foreach($trait->requiredForTraits as $requiredFor)
                    <li>{{ $requiredFor->link(32) }}</li>
                @endforeach
            </ul>
        @endif

        @if(count($trait->requiresTraits) > 0)
            <h3>Affected by Traits</h3>
            <ul class="itemList">
                @foreach($trait->requiresTraits as $requiredFor)
                    <li>{{ $requiredFor->link(32) }}</li>
                @endforeach
            </ul>
        @endif
    </div>

    <style>.traitDetails > .tooltip {
        border: none; box-shadow: none; padding: 0;
    } .traitDetails > .tooltip:nth-of-type(1) > header {
        display: none;
    }</style>
</div>
