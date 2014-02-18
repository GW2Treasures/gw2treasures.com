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
		<div class="timeToCraft">{{ round( $recipe->getData( )->time_to_craft_ms / 1000, 2 ) }}s <i class="sprite-20-activation"></i></div>
	@endif
	{{-- disciplines --}}
	<div class="disciplines">
		@if( $recipe->hasDiscipline( Recipe::DISCIPLINE_ARMORSMITH ))
			<i class="sprite-20-armorsmith"    title="{{ trans('recipe.discipline.armorsmith') }}"></i>
		@endif
		@if( $recipe->hasDiscipline( Recipe::DISCIPLINE_ARTIFICER ))
			<i class="sprite-20-artificer"     title="{{ trans('recipe.discipline.artificer') }}"></i>
		@endif
		@if( $recipe->hasDiscipline( Recipe::DISCIPLINE_CHEF ))
			<i class="sprite-20-chef"          title="{{ trans('recipe.discipline.chef') }}"></i>
		@endif
		@if( $recipe->hasDiscipline( Recipe::DISCIPLINE_HUNTSMAN ))
			<i class="sprite-20-huntsman"      title="{{ trans('recipe.discipline.huntsman') }}"></i>
		@endif
		@if( $recipe->hasDiscipline( Recipe::DISCIPLINE_JEWELER ))
			<i class="sprite-20-jeweler"       title="{{ trans('recipe.discipline.jeweler') }}"></i>
		@endif
		@if( $recipe->hasDiscipline( Recipe::DISCIPLINE_LEATHERWORKER ))
			<i class="sprite-20-leatherworker" title="{{ trans('recipe.discipline.leatherworker') }}"></i>
		@endif
		@if( $recipe->hasDiscipline( Recipe::DISCIPLINE_TAILOR ))
			<i class="sprite-20-tailor"        title="{{ trans('recipe.discipline.tailor') }}"></i>
		@endif
		@if( $recipe->hasDiscipline( Recipe::DISCIPLINE_WEAPONSMITH ))
			<i class="sprite-20-weaponsmith"   title="{{ trans('recipe.discipline.weaponsmith') }}"></i>
		@endif
		{{ $recipe->rating }}
	</div>
</div>