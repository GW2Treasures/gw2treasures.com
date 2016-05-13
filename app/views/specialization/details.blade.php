<header class="itemHeader">
    <div class="pageWidth">
        <img class="icon" width="64" height="64" src="{{ $specialization->getIconUrl(64) }}" alt="">
        <h2><div aria-hidden="true" class="overflow">{{ $specialization->getName() }}</div>{{ $specialization->getName() }}</h2>
        <nav class="details__breadcrumb">
            <strong><a href="{{ route('specialization.overview', App::getLocale()) }}">{{ trans('specialization.breadcrumb') }}</a></strong>
            <svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
            {{ trans('misc.profession.'.$specialization->profession) }}
        </nav>
    </div>
</header>

<div class="itemDetails pageWidth">
    <div class="sidebar">
        @if( App::getLocale() != 'de' )
            <div class="lang"><span title="Deutsch"  class='langCode'>DE</span> {{ $specialization->link(null, 'de', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'en' )
            <div class="lang"><span title="English"  class='langCode'>EN</span> {{ $specialization->link(null, 'en', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'es' )
            <div class="lang"><span title="Español"  class='langCode'>ES</span> {{ $specialization->link(null, 'es', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'fr' )
            <div class="lang"><span title="Français" class='langCode'>FR</span> {{ $specialization->link(null, 'fr', null, null, ['rel' => 'alternate']) }}</div>
        @endif

        <h3>@lang('misc.share.header')</h3>
        <ul class="sidebar-share">
            <li class="twitter" ><a target="_blank" title="{{ trans('misc.share.twitter')  }}" data-dialog href="https://twitter.com/share?url={{ urlencode( $specialization->getUrl() ) }}&via=GW2Treasures&text={{ urlencode( $specialization->getName() ) }}"><i class="sprite-share-twitter">Twitter</i></a></li>
            <li class="google"  ><a target="_blank" title="{{ trans('misc.share.google')   }}" data-dialog href="https://plus.google.com/share?url={{ urlencode( $specialization->getUrl() ) }}"><i class="sprite-share-google">Google</i></a></li>
            <li class="facebook"><a target="_blank" title="{{ trans('misc.share.facebook') }}" data-dialog href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode( $specialization->getUrl() ) }}"><i class="sprite-share-facebook">Facebook</i></a></li>
            <li class="reddit"  ><a target="_blank" title="{{ trans('misc.share.reddit')   }}" href="https://www.reddit.com/submit?url={{ urlencode( (Request::secure() ? 'https://' : 'http://' ) . Config::get('app.domain') . route('specialization.details', ['language' => null, 'specialization' => $specialization->id], false) ) }}&title={{ $specialization->getName() }}"><i class="sprite-share-reddit">Reddit</i></a></li>
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

    <div class="specializationDetails" style="padding-top: 10px">
        <h3>Traits</h3>
        {{--            {{ dd($specialization->getTrait($specialization->getData()->weapon_trait)) }}--}}

        <table class="table">
            <thead>
                <tr>
                    <th>{{ trans('specialization.tier.1') }}</th>
                    <th>{{ trans('specialization.tier.2') }}</th>
                    <th>{{ trans('specialization.tier.3') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    @for($i = 1; $i <= 3; $i++)
                        <td>
                            <ul class="itemList" style="column-count: 1">
                                @foreach($specialization->traits->sortByDesc('slot')->groupBy('tier')->get($i) as $trait)
                                    <li>{{ $trait->link(32) }}</li>
                                @endforeach
                            </ul>
                        </td>
                    @endfor
                </tr>
                @if(isset($specialization->getData()->weapon_trait))
                    <tr>
                        <td colspan="3">
                            <ul class="itemList" style="column-count: 1">
                                <li>{{ $specialization->getTrait($specialization->getData()->weapon_trait)->link(32) }}</li>
                            </ul>
                        </td>
                    </tr>
                @endif
            </tbody>
        </table>

    </div>
</div>
