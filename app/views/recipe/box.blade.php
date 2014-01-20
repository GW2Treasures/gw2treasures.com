<div class="recipeBox">
	{{-- unlockedBy --}}
	@if( $recipe->hasFlag( 'LearnedFromItem' ) )
		@if( !is_null( $recipe->unlockedBy ) && $recipe->unlockedBy->unlock_type == 'CraftingRecipe' )
			<a href="{{ $recipe->unlockedBy->getUrl() }}">
				<img src="{{ $recipe->unlockedBy->getIconUrl() }}" width="16" height="16" alt="">
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
					<a href="{{ $ingredient->getUrl() }}">
						<img src="{{ $ingredient->getIconUrl() }}" width="16" height="16" alt="">
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
			<a href="{{ $recipe->output->getUrl() }}">
				<img src="{{ $recipe->output->getIconUrl() }}" width="16" height="16" alt="">
				{{ $recipe->output->getName() }}
			</a>
		@else
			<span style="font-style: italic">???</span>
		@endif
	</div>
	{{-- time to craft --}}
	@if( $recipe->getData( )->time_to_craft_ms > 0 )
		<div class="timeToCraft">{{ round( $recipe->getData( )->time_to_craft_ms / 1000, 2 ) }}s</div>
	@endif
	{{-- disciplines --}}
	<div class="disciplines">
		@if( $recipe->hasDiscipline(Recipe::DISCIPLINE_ARMORSMITH) )
			<img src="//assets.gw2treasures.de/img/Armorsmith_tango_icon_20px.png"    width="20" height="20" title="{{ trans('recipe.disciplines.armorsmith') }}"    alt="{{ trans('recipe.disciplines.armorsmith') }}">
		@endif
		@if( $recipe->hasDiscipline(Recipe::DISCIPLINE_ARTIFICER) )
			<img src="//assets.gw2treasures.de/img/Artificer_tango_icon_20px.png"     width="20" height="20" title="{{ trans('recipe.disciplines.artificer') }}"     alt="{{ trans('recipe.disciplines.artificer') }}">
		@endif
		@if( $recipe->hasDiscipline(Recipe::DISCIPLINE_CHEF) )
			<img src="//assets.gw2treasures.de/img/Chef_tango_icon_20px.png"          width="20" height="20" title="{{ trans('recipe.disciplines.chef') }}"          alt="{{ trans('recipe.disciplines.chef') }}">
		@endif
		@if( $recipe->hasDiscipline(Recipe::DISCIPLINE_HUNTSMAN) )
			<img src="//assets.gw2treasures.de/img/Huntsman_tango_icon_20px.png"      width="20" height="20" title="{{ trans('recipe.disciplines.huntsman') }}"      alt="{{ trans('recipe.disciplines.huntsman') }}">
		@endif
		@if( $recipe->hasDiscipline(Recipe::DISCIPLINE_JEWELER) )
			<img src="//assets.gw2treasures.de/img/Jeweler_tango_icon_20px.png"       width="20" height="20" title="{{ trans('recipe.disciplines.jeweler') }}"       alt="{{ trans('recipe.disciplines.jeweler') }}">
		@endif
		@if( $recipe->hasDiscipline(Recipe::DISCIPLINE_LEATHERWORKER) )
			<img src="//assets.gw2treasures.de/img/Leatherworker_tango_icon_20px.png" width="20" height="20" title="{{ trans('recipe.disciplines.leatherworker') }}" alt="{{ trans('recipe.disciplines.leatherworker') }}">
		@endif
		@if( $recipe->hasDiscipline(Recipe::DISCIPLINE_TAILOR) )
			<img src="//assets.gw2treasures.de/img/Tailor_tango_icon_20px.png"        width="20" height="20" title="{{ trans('recipe.disciplines.tailor') }}"        alt="{{ trans('recipe.disciplines.tailor') }}">
		@endif
		@if( $recipe->hasDiscipline(Recipe::DISCIPLINE_WEAPONSMITH) )
			<img src="//assets.gw2treasures.de/img/Weaponsmith_tango_icon_20px.png"   width="20" height="20" title="{{ trans('recipe.disciplines.weaponsmith') }}"   alt="{{ trans('recipe.disciplines.weaponsmith') }}">
		@endif
		{{ $recipe->rating }}
	</div>
</div>