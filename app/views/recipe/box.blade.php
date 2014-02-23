<div class="recipeBox">
	{{-- unlockedBy --}}
	@if( $recipe->hasFlag( 'LearnedFromItem' ) )
		@if( !is_null( $recipe->unlockedBy ) && $recipe->unlockedBy->unlock_type == 'CraftingRecipe' )
			<a data-item-id="{{ $recipe->unlockedBy->id }}" href="{{ $recipe->unlockedBy->getUrl() }}">
				<img src="{{ $recipe->unlockedBy->getIconUrl( 16 ) }}" width="16" height="16" alt="">
				{{ $recipe->unlockedBy->getName() }}
			</a>
		@else
			???
		@endif
	@endif

	{{-- Ingredients --}}
	<ul class="ingredients">
		<?php $counts = $recipe->getIngredientCounts(); ?>
		@foreach( $recipe->getIngredients() as $i => $ingredient)
			@if( $counts[ $i ] > 0 )
				<li>
					<span class="count">{{ $counts[ $i ] }}</span>
					<a data-item-id="{{ $ingredient->id }}" href="{{ $ingredient->getUrl() }}">
						<img src="{{ $ingredient->getIconUrl( 16 ) }}" width="16" height="16" alt="">
						{{ $ingredient->getName() }}
					</a>
				</li>
			@endif
		@endforeach
	</ul>
	{{-- Output --}}
	<div class="output">
		<span class="count">{{ $recipe->output_count }}</span>
		@if( !is_null( $recipe->output ) )
			<a data-item-id="{{ $recipe->output->id }}" href="{{ $recipe->output->getUrl() }}">
				<img src="{{ $recipe->output->getIconUrl( 16 ) }}" width="16" height="16" alt="">
				{{ $recipe->output->getName() }}
			</a>
		@else
			<span style="font-style: italic">???</span>
		@endif
	</div>
	{{-- time to craft --}}
	@if( $recipe->getData( )->time_to_craft_ms > 0 )
		<div class="timeToCraft">{{ Helper::duration( $recipe->getData( )->time_to_craft_ms ) }} <i class="sprite-20-activation"></i></div>
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
</div>