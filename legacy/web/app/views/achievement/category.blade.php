<header class="itemHeader">
    <div class="pageWidth">
        <img class="icon" width="64" height="64" src="{{ $category->getIconUrl(64) }}" alt="">
        <h2>{{ $category->getName() }}</h2>
        <nav class="details__breadcrumb">
            <strong><a href="{{ route('achievement.overview', App::getLocale()) }}">{{ trans('header.achievements') }}</a></strong>
                @if(!is_null($category->group))
                    <svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                    <a href="{{ URL::route('achievement.overview', App::getLocale()) }}#{{ $category->group->id }}">
                        {{ $category->group->getName() }}</a>
                @endif
        </nav>
    </div>
</header>


<div class="itemDetails pageWidth clearfix">
    <div class="sidebar">
        @if( App::getLocale() != 'de' )
            <div class="lang"><span title="Deutsch"  class='langCode'>DE</span> <a rel="alternate" hreflang="de" href="{{ URL::route('achievement.category', array('de', $category->id)) }}">{{ $category->getName( 'de' ) }}</a></div>
        @endif
        @if( App::getLocale() != 'en' )
            <div class="lang"><span title="English"  class='langCode'>EN</span> <a rel="alternate" hreflang="en" href="{{ URL::route('achievement.category', array('en', $category->id)) }}">{{ $category->getName( 'en' ) }}</a></div>
        @endif
        @if( App::getLocale() != 'es' )
            <div class="lang"><span title="Español"  class='langCode'>ES</span> <a rel="alternate" hreflang="es" href="{{ URL::route('achievement.category', array('es', $category->id)) }}">{{ $category->getName( 'es' ) }}</a></div>
        @endif
        @if( App::getLocale() != 'fr' )
            <div class="lang"><span title="Français" class='langCode'>FR</span> <a rel="alternate" hreflang="fr" href="{{ URL::route('achievement.category', array('fr', $category->id)) }}">{{ $category->getName( 'fr' ) }}</a></div>
        @endif

        <h3>@lang('misc.share.header')</h3>
        <ul class="sidebar-share">
            <li class="twitter" ><a target="_blank" title="{{ trans('misc.share.twitter')  }}" data-dialog href="https://twitter.com/share?url={{ urlencode( $category->getUrl() ) }}&via=GW2Treasures&text={{ urlencode( $category->getName() ) }}"><i class="sprite-share-twitter">Twitter</i></a></li>
            <li class="google"  ><a target="_blank" title="{{ trans('misc.share.google')   }}" data-dialog href="https://plus.google.com/share?url={{ urlencode( $category->getUrl() ) }}"><i class="sprite-share-google">Google</i></a></li>
            <li class="facebook"><a target="_blank" title="{{ trans('misc.share.facebook') }}" data-dialog href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode( $category->getUrl() ) }}"><i class="sprite-share-facebook">Facebook</i></a></li>
            <li class="reddit"  ><a target="_blank" title="{{ trans('misc.share.reddit')   }}" href="https://www.reddit.com/submit?url={{ urlencode( (Request::secure() ? 'https://' : 'http://' ) . Config::get('app.domain') . route('achievement.category', ['language' => null, 'category' => $category->id], false) ) }}&title={{ $category->getName() }}"><i class="sprite-share-reddit">Reddit</i></a></li>
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
        <p class="achievement__description">{{ $category->getDescription() }}</p>

        <?php
            list($current, $historic) =  $category->achievements
                ->sort(Helper::sortByName())
                ->groupBy('historic')->toArray() + [[], []]
        ?>

        <ul class="itemList">
            @foreach($current as $achievement)
                @if(!$achievement->historic)
                    <li>{{ $achievement->link(32) }}
                @endif
            @endforeach
        </ul>

        @if(!empty($historic))
            <h3>Historic</h3>
            <ul class="itemList">
                @foreach($historic as $achievement)
                    @if($achievement->historic)
                        <li>{{ $achievement->link(32) }}
                    @endif
                @endforeach
            </ul>
        @endif
    </div>
</div>
