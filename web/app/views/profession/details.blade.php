<header class="itemHeader">
    <div class="pageWidth">
        <img class="icon" width="64" height="64" src="{{ $profession->getBigIconUrl(64) }}" alt="">
        <h2>{{ $profession->getName() }}</h2>
        <nav class="details__breadcrumb">
            <strong><a href="{{ route('profession.overview', App::getLocale()) }}">{{ trans('profession.breadcrumb') }}</a></strong>
        </nav>
    </div>
</header>

<div class="itemDetails pageWidth">
    <div class="sidebar">
        @if( App::getLocale() != 'de' )
            <div class="lang"><span title="Deutsch"  class='langCode'>DE</span> {{ $profession->link(null, 'de', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'en' )
            <div class="lang"><span title="English"  class='langCode'>EN</span> {{ $profession->link(null, 'en', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'es' )
            <div class="lang"><span title="Español"  class='langCode'>ES</span> {{ $profession->link(null, 'es', null, null, ['rel' => 'alternate']) }}</div>
        @endif
        @if( App::getLocale() != 'fr' )
            <div class="lang"><span title="Français" class='langCode'>FR</span> {{ $profession->link(null, 'fr', null, null, ['rel' => 'alternate']) }}</div>
        @endif

        <h3>@lang('misc.share.header')</h3>
        <ul class="sidebar-share">
            <li class="twitter" ><a target="_blank" title="{{ trans('misc.share.twitter')  }}" data-dialog href="https://twitter.com/share?url={{ urlencode( $profession->getUrl() ) }}&via=GW2Treasures&text={{ urlencode( $profession->getName() ) }}"><i class="sprite-share-twitter">Twitter</i></a></li>
            <li class="google"  ><a target="_blank" title="{{ trans('misc.share.google')   }}" data-dialog href="https://plus.google.com/share?url={{ urlencode( $profession->getUrl() ) }}"><i class="sprite-share-google">Google</i></a></li>
            <li class="facebook"><a target="_blank" title="{{ trans('misc.share.facebook') }}" data-dialog href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode( $profession->getUrl() ) }}"><i class="sprite-share-facebook">Facebook</i></a></li>
            <li class="reddit"  ><a target="_blank" title="{{ trans('misc.share.reddit')   }}" href="https://www.reddit.com/submit?url={{ urlencode( (Request::secure() ? 'https://' : 'http://' ) . Config::get('app.domain') . route('profession.details', ['language' => null, 'profession' => $profession->id], false) ) }}&title={{ $profession->getName() }}"><i class="sprite-share-reddit">Reddit</i></a></li>
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

    <div class="professionDetails" style="padding-top: 10px">
        <h2>{{ trans('specialization.breadcrumb') }}</h2>

        <ul class="itemList">
            @foreach($profession->specializations as $specialization)
                <li>{{ $specialization->link(32) }}</li>
            @endforeach
        </ul>


        <h2>{{ trans('profession.weapons') }}</h2>
        <div class="weapon-list">
            @foreach($profession->getData()->weapons as $weapon => $weaponDetails)
                <div class="weapon-list__weapon">
                    <h3>{{ trans('item.subtype.Weapon.'.$weapon) }}</h3>
                    @if(isset($weaponDetails->specialization))
                        <p>Requires {{ Specialization::remember(3)->find($weaponDetails->specialization)->link(16) }}.</p>
                    @endif

                    @foreach($weaponDetails->skills as $skills)
                        @if($skills->first()->requirement !== '')
                            {{ trans('profession.requirement.'.$skills->first()->requirement) }}
                        @endif
                        <ul class="weapon-slots clearfix {{ !$weaponDetails->is2Handed ? 'weapon-slots--1handed' : '' }}">
                            @for($i = 0; $i < 5; $i++)
                                @if(isset($skills[$i]))
                                    @if($skills[$i]->skill != null)
                                        <li>{{ $skills[$i]->skill->link(32, null, '') }}</li>
                                    @else
                                        <li><span class="empty-weapon-slot">?</span></li>
                                    @endif
                                @else
                                    <li><span class="empty-weapon-slot"></span></li>
                                @endif
                            @endfor
                        </ul>
                    @endforeach
                </div>
            @endforeach
        </div>

        <style>
            .weapon-list { column-width: 450px; margin-bottom: 40px; }
            .weapon-list> .weapon-list__weapon { break-inside: avoid; overflow: hidden; }
            .weapon-slots { list-style: none; display: block; padding: 0; }
            .weapon-slots > li { display: inline-block; float: left; }
            .weapon-slots--1handed > li:nth-child(3) { margin-right: .5em; border-right: 1px solid #eee; }
            .empty-weapon-slot { width: 32px; height: 32px; display: inline-block; background: #f9f9f9;
                border: 1px solid #eee; margin-right: .5em; vertical-align: top; }
        </style>

        <h2>{{ trans('profession.training.headline') }}</h2>
        @foreach($profession->getData()->training as $training)
            <h3>{{ $training->name }} ({{ trans('profession.training.category.'.$training->category) }})</h3>

            <ul class="itemList">
                @foreach($training->track as $t)
                    @if($t->type == 'Trait')
                        <li>{{ Traits::remember(3)->find($t->trait_id)->link(32) }} ({{ $t->cost }})</li>
                    @elseif($t->type == 'Skill')
                        <li>{{ Skill::remember(3)->find($t->skill_id)->link(32) }} ({{ $t->cost }})</li>
                    @endif
                @endforeach
            </ul>
        @endforeach

    </div>
</div>
