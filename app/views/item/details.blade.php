<header class="itemHeader">
    <div class="pageWidth">
        <img class="icon" width="64" height="64" src="{{ $item->getIconUrl() }}" alt="">
        <h2 class="color-{{ $item->rarity }}">{{ $item->getName() }}</h2>
        <nav class="details__breadcrumb">
            <strong><a href="{{ route('search', App::getLocale()) }}">{{ trans('header.items') }}</a></strong>
            <svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg> {{ trans('item.type.'.$item->type) }}
            @if( isset($item->getTypeData()->type) )
                <svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg> {{ trans( 'item.subtype.' . $item->type . '.' . $item->getTypeData()->type ) }}
            @elseif( $item->sub_type != '' )
                <svg fill="#000000" height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg> {{ trans( 'item.subtype.' . $item->type . '.' . $item->subtype ) }}
            @endif
        </nav>
    </div>
</header>

<div class="itemDetails pageWidth">
    {{ $item->getTooltip() }}

    <div class="sidebar">
        @if( App::getLocale() != 'de' )
            <div class="lang"><span title="Deutsch"  class="langCode">DE</span> <a rel="alternate" hreflang="de" href="{{ $item->getUrl('de') }}" data-item-id="{{ $item->id }}">{{ $item->getName( 'de' ) }}</a></div>
        @endif
        @if( App::getLocale() != 'en' )
            <div class="lang"><span title="English"  class="langCode">EN</span> <a rel="alternate" hreflang="en" href="{{ $item->getUrl('en') }}" data-item-id="{{ $item->id }}">{{ $item->getName( 'en' ) }}</a></div>
        @endif
        @if( App::getLocale() != 'es' )
            <div class="lang"><span title="Español"  class="langCode">ES</span> <a rel="alternate" hreflang="es" href="{{ $item->getUrl('es') }}" data-item-id="{{ $item->id }}">{{ $item->getName( 'es' ) }}</a></div>
        @endif
        @if( App::getLocale() != 'fr' )
            <div class="lang"><span title="Français" class="langCode">FR</span> <a rel="alternate" hreflang="fr" href="{{ $item->getUrl('fr') }}" data-item-id="{{ $item->id }}">{{ $item->getName( 'fr' ) }}</a></div>
        @endif

        <h3>@lang('misc.tradingpost.header')</h3>

        @if(count(array_intersect(['AccountBound', 'SoulbindOnAcquire', 'MonsterOnly'], $item->getData()->flags)) == 0)
            <dl class="sidebar-tp loading only-js" data-tp-item-id="{{ $item->id }}">
                <dt>@lang('misc.tradingpost.sell'):</dt>
                <dd>
                    <span class="money" id="tp-a-v">…</span>
                    <span class="amount">({{ trans('misc.tradingpost.available', array( 'amount' => '<span id="tp-a-a">0</span>' )) }})</span>
                </dd>
                <dt>@lang('misc.tradingpost.buy'):</dt>
                <dd>
                    <span class="money" id="tp-o-v">…</span>
                    <span class="amount">({{ trans('misc.tradingpost.ordered', array( 'amount' => '<span id="tp-o-a">0</span>' )) }})</span>
                </dd>
            </dl>

            <a class="only-no-js" target="_blank" onclick="outbound(this)" href="https://www.gw2spidy.com/item/{{ $item->id }}">Guild Wars 2 Spidy</a>
        @else
            <p>{{ trans('misc.tradingpost.notTradable') }}</p>
        @endif


        <h3>@lang('misc.wiki.header')</h3>
        <ul class="sidebar-wikis">
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki-de.guildwars2.com/index.php?title=Spezial:Suche&amp;search={{ urlencode( $item->getName( 'de' ) ) }}">@lang('misc.wiki.german')</a></li>
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki.guildwars2.com/index.php?title=Special:Search&amp;search={{ urlencode( $item->getName( 'en' ) ) }}">@lang('misc.wiki.english')</a></li>
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki-es.guildwars2.com/index.php?title=Especial:Buscar&amp;search={{ urlencode( $item->getName( 'es' ) ) }}">@lang('misc.wiki.spanish')</a></li>
            <li><a target="_blank" onclick="outbound(this)" href="http://wiki-fr.guildwars2.com/index.php?title=Spécial:Recherche&amp;search={{ urlencode( $item->getName( 'fr' ) ) }}">@lang('misc.wiki.french')</a></li>
        </ul>

        <h3>@lang('misc.share.header')</h3>
        <ul class="sidebar-share">
            <li class="chatlink">
                <input title="{{ trans('misc.share.chatlink') }}" readonly value="{{ e( $item->getChatLink() ) }}" class="chatlink">
            </li>
            <li class="twitter" ><a target="_blank" title="{{ trans('misc.share.twitter')  }}" data-dialog href="https://twitter.com/share?url={{ urlencode( $item->getUrl() ) }}&via=GW2Treasures&text={{ urlencode( $item->getName() ) }}"><i class="sprite-share-twitter">Twitter</i></a></li>
            <li class="google"  ><a target="_blank" title="{{ trans('misc.share.google')   }}" data-dialog href="https://plus.google.com/share?url={{ urlencode( $item->getUrl() ) }}"><i class="sprite-share-google">Google</i></a></li>
            <li class="facebook"><a target="_blank" title="{{ trans('misc.share.facebook') }}" data-dialog href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode( $item->getUrl() ) }}"><i class="sprite-share-facebook">Facebook</i></a></li>
            <li class="reddit"  ><a target="_blank" title="{{ trans('misc.share.reddit')   }}" href="https://www.reddit.com/submit?url={{ urlencode( (Request::secure() ? 'https://' : 'http://' ) . Config::get('app.domain') . route('itemdetails', ['language' => null, 'item' => $item->id], false) ) }}&title={{ $item->getName() }}"><i class="sprite-share-reddit">Reddit</i></a></li>
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

    @if( $item->type == 'UpgradeComponent' && in_array($item->subtype, ['Rune', 'Sigil']) &&
        count( $tiers = Item::whereType($item->type)->whereSubtype($item->subtype)->wherePvp(false)
                            ->where('name_en', 'LIKE', DB::raw('"%'.$item->getTypeData('en')->suffix.'"'))
                            ->orderBy('level', 'ASC')->orderBy('value', 'ASC')->get() ) > 1
    )
        <h3>{{ trans('item.tiers') }}</h3>
        <ul class="itemList itemList--singleColumn">
            @foreach( $tiers as $tierItem )
                @if( $tierItem->id === $item->id )
                    <li style="font-weight: bold;">{{ $tierItem->link(32) }}</li>
                @else
                    <li>{{ $tierItem->link(32) }}</li>
                @endif
            @endforeach
        </ul>
    @endif

    @if( $item->type == 'UpgradeComponent' && count( $upgradeFor = Item::hasUpgrade( $item )->get()) > 0 )
        <?php
            $upgradeFor->sort( function( $a, $b ) use ( $item ) {
                return strcmp( $a->getName(), $b->getName() );
            });
        ?>
        <h3>{{ trans('item.upgradeFor') }}</h3>
        <ul class="itemList">
            @foreach ($upgradeFor as $usesThisAsUpgrade)
                <li>{{ $usesThisAsUpgrade->link(32) }}</li>
            @endforeach
        </ul>
    @endif

    @if( $item->unlock_type == 'CraftingRecipe' && !is_null( $item->unlocks ))
        <h3>{{ trans('item.unlocks') }}</h3>
        @include( 'recipe.box', array( 'recipe' => $item->unlocks ))
        @if(!empty($item->getTypeData()->extra_recipe_ids))
            @foreach(Recipe::findMany($item->getTypeData()->extra_recipe_ids) as $extraRecipe)
                @include('recipe.box', [ 'recipe' => $extraRecipe ])
            @endforeach
        @endif
    @elseif( $item->unlock_type == 'CraftingRecipe' && strpos($item->getName('en'), 'Recipe: ') === 0 )
        <h3>{{ trans('item.unlocks') }}</h3>
        <p>{{ trans('item.unlocksUnknownRecipe', ['chatlink' => (new \GW2Treasures\GW2Tools\Chatlinks\RecipeChatlink($item->getTypeData()->recipe_id))->encode()]) }}</p>
        <ul class="itemList">
            @foreach( $unlockedItems = Item::whereNameEn( substr($item->getName('en'), strlen('Recipe: ')) )->get() as $unlockedItem )
                <li>{{ $unlockedItem->link(32) }}</li>
            @endforeach
        </ul>
    @endif

    @if( count( $craftedFrom = $item->recipes()->get()) > 0 )
        <h3>{{ trans('item.craftedFrom') }}</h3>
        @foreach( $craftedFrom as $recipe )
            @include( 'recipe.box', array( 'recipe' => $recipe ))
        @endforeach
    @elseif( !is_null( $recipe = Item::whereNameEn('Recipe: '.$item->getName('en'))->first() ))
        <h3>{{ trans('item.craftedFrom') }}</h3>
        <p>{{ trans('item.craftedFromUnknownRecipe', ['chatlink' => (new \GW2Treasures\GW2Tools\Chatlinks\RecipeChatlink($recipe->getTypeData()->recipe_id))->encode()]) }}</p>
        {{ $recipe->link(32) }}
    @endif

    @if( count( $usedInCrafting = $item->ingredientForRecipes()->orderBy( 'rating' )->orderBy( 'disciplines' )->get()) > 0 )
        <h3 class="clear">{{ trans('item.usedInCrafting') }}</h3>
        @include( 'recipe.table', array( 'recipes' => $usedInCrafting ))
    @endif

    <?php
        $achievementObjective = Achievement::requiresItem($item->id)->get();
        $achievementReward = Achievement::rewardsItem($item->id)->get();

        $achievementCount = count($achievementObjective) + count($achievementReward);
    ?>

    @if($achievementCount > 0)
        <h3{{ $achievementCount >= 8 ? ' style="clear:both"' : '' }}>{{ trans('item.achievements.header') }}</h3>
    @endif
    @if(count($achievementObjective) > 0)
        <p>{{ trans('item.achievements.required') }}</p>
        <ul class="itemList">
            @foreach($achievementObjective as $achievement)
                <li>{{ $achievement->link(32) }}</li>
            @endforeach
        </ul>
    @endif
    @if(count($achievementReward) > 0)
        <p>{{ trans('item.achievements.reward') }}</p>
        <ul class="itemList">
            @foreach($achievementReward as $achievement)
                <li>{{ $achievement->link(32) }}</li>
            @endforeach
        </ul>
    @endif

    {{--@if($item->id === 39752)
        <h3>{{ trans('item.achievements.header') }}</h3>
        <p>{{ trans('misc.achievements.festival_reward.text', ['link' => '<a href="'.route('achievement.overview', App::getLocale()).'">'.trans('misc.achievements.festival_reward.link').'</a>']) }}</p>
    @endif--}}

    @if( count( $similarItems = $item->getSimilarItems()) > 0 )
        <?php
            $similarItems->sort( function( $a, $b ) use ( $item ) {
                if( $a->getName() == $item->getName() &&
                    $b->getName() != $item->getName() ) {
                    return -1;
                }
                if( $a->getName() != $item->getName() &&
                    $b->getName() == $item->getName() ) {
                    return 1;
                }
                return strcmp( $a->getName(), $b->getName() );
            });
            $hideSomeSimilarItems = count( $similarItems ) > 20;
        ?>
        <a class="anchor" id="similar"></a>
        <h3 class="headerSimilar">{{ trans('item.similar') }}</h3>
        <ul class="itemList itemListSimilar">
            @for( $i = 0; $i < count( $similarItems ) && ( $hideSomeSimilarItems ? $i < 9 : true ); $i++ )
                <?php $similarItem = $similarItems[ $i ] ?>
                <li>{{ $similarItem->link( 32 ) }}
            @endfor
            @if( $hideSomeSimilarItems )
                <li class="showMore"><a href="#similar">
                    <span style="display:inline-block; width:32px; height:32px; vertical-align: middle"></span>
                    {{ trans( 'item.showMoreSimilarItems', array( 'count' => count( $similarItems ) - 9 )) }}</a>
                @for( $i = 9; $i < count( $similarItems ); $i++ )
                    <?php $similarItem = $similarItems[ $i ] ?>
                    <li class="similarHidden">{{ $similarItem->link( 32 ) }}
            @endfor
            @endif
        </ul>
    @endif
</div>
