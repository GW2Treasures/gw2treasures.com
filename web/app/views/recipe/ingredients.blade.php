<ul class="ingredients">
    <?php $counts = $recipe->getIngredientCounts(); $types = $recipe->getIngredientTypes(); ?>
    @foreach( $recipe->getIngredients() as $i => $ingredient)
        @if( $counts[ $i ] > 0 )
            <li>
                <span class="count">{{ $counts[ $i ] }}</span>
                @if( $types[ $i ] === 'Item' )
                    @if( !is_null($ingredient) )
                        {{ $ingredient->link(16) }}
                    @else
                        <span class="chatlink--inline">{{
                            (new \GW2Treasures\GW2Tools\Chatlinks\ItemChatlink(\GW2Treasures\GW2Tools\Common\ItemStack::fromArray(['id' => $recipe->getIngredientIDs()[$i]])))->encode()
                        }}</span>
                    @endif
                @elseif( $types[$i] === 'Currency' )
                    @if( !is_null($ingredient) )
                        {{ $ingredient->link(16) }}
                    @else
                        Unknown currency
                    @endif
                @elseif( $types[$i] === 'GuildUpgrade' )
                    @if( !is_null($ingredient) )
                        {{ $ingredient->link(16) }}
                    @else
                        Unknown guild upgrade
                    @endif
                @else
                    {{ $types[ $i ] }}
                @endif
            </li>
        @endif
    @endforeach
</ul>
