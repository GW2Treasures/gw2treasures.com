<div class="recipeBox {{ !is_null( $recipe->output ) ? 'border-' . $recipe->output->rarity : '' }}">
    <span id="r{{ $recipe->recipe_id }}" class="anchor"></span>
    <header>
        <div class="output color-{{ $recipe->output->rarity }}">
            @if( $recipe->output_count == 1 )
                {{ $recipe->output->link( 32 ) }}
            @else
                {{ $recipe->output->link( 32, null, $recipe->output_count . '× ' . $recipe->output->getName() ) }}
                {{-- {{ $recipe->output->link( 32, null, $recipe->output->getName() . ' ×' . $recipe->output_count ) }} --}}
            @endif
        </div>
    </header>

    {{-- time to craft --}}
    @if( $recipe->getData()->time_to_craft_ms > 0 )
        <div class="timeToCraft">{{ Helper::duration( $recipe->getData()->time_to_craft_ms ) }} <i class="sprite-20-activation"></i></div>
    @endif

    {{-- disciplines --}}
    <div class="disciplines">
        <?php
            foreach( Recipe::$DISCIPLINES as $dFlag => $discipline ) {
                if( $recipe->hasDiscipline( $dFlag )) {
                    echo '<i class="sprite-20-' . $discipline . '" title="' . trans('recipe.discipline.' . $discipline) . '"></i>';
                }
            }
        ?>
        {{ $recipe->rating }}
    </div>

    @if($recipe->type === 'RefinementEctoplasm')
        <div class="recipeBox__refinementEctoplasm">
            <i class="sprite-20-recharge"></i>
            @lang('recipe.refinementEctoplasm')
        </div>
    @endif

    {{-- Ingredients --}}
    <ul class="ingredients">
        <?php $counts = $recipe->getIngredientCounts(); ?>
        @foreach( $recipe->getIngredients() as $i => $ingredient)
            @if( $counts[ $i ] > 0 )
                <li>
                    <span class="count">{{ $counts[ $i ] }}</span>
                    @if( !is_null($ingredient) )
                        {{ $ingredient->link(16) }}
                    @else
                        <span class="chatlink--inline">{{
                            (new \GW2Treasures\GW2Tools\Chatlinks\ItemChatlink(\GW2Treasures\GW2Tools\Common\ItemStack::fromArray(['id' => $recipe->getIngredientIDs()[$i]])))->encode()
                        }}</span>
                    @endif
                </li>
            @endif
        @endforeach
    </ul>

    {{-- unlockedBy --}}
    @if( $recipe->hasFlag( 'LearnedFromItem' ) )
        <div class="recipe">
            <span class="recipeLabel">{{ trans('recipe.unlockedBy') }}:</span>
            @if( !is_null( $recipe->unlockedBy ) && $recipe->unlockedBy->unlock_type == 'CraftingRecipe' )
                {{ $recipe->unlockedBy->link(16) }}
            @else
                Unknown item
            @endif
        </div>
    @endif

</div>
