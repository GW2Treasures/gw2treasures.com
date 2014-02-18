<table class="recipeTable">
	<thead><tr>
		<th>{{ trans( 'recipe.output' ) }}</th>
		<th>{{ trans( 'recipe.disciplines' ) }}</th>
		<th>{{ trans( 'recipe.ingredients' ) }}</th>
	</tr></thead>
	<tbody>
		@foreach( $recipes as $recipe )
			<tr class="{{ $recipe->hasFlag( 'LearnedFromItem' ) ? 'learnedFromItem' : '' }}">
				<td>
					{{-- output --}}
					<span class="count">{{ $recipe->output_count == 1 ? '' : $recipe->output_count }}</span>
					@if( !is_null( $recipe->output ) )
						<a data-item-id="{{ $recipe->output->id }}" href="{{ $recipe->output->getUrl() }}">
							<img src="{{ $recipe->output->getIconUrl( 32 ) }}" width="32" height="32" alt="">
							{{ $recipe->output->getName() }}
						</a>
					@else
						<span style="font-style: italic">???</span>
					@endif

					{{-- unlocked by --}}
					@if( $recipe->hasFlag( 'LearnedFromItem' ))
						<div class="unlockedBy">
							{{ trans('recipe.unlockedBy') }}:
							@if( !is_null( $recipe->unlockedBy ) && $recipe->unlockedBy->unlock_type == 'CraftingRecipe' )
								<a data-item-id="{{ $recipe->unlockedBy->id }}" href="{{ $recipe->unlockedBy->getUrl() }}">
									<img src="{{ $recipe->unlockedBy->getIconUrl( 16 ) }}" width="16" height="16" alt="">
									{{ $recipe->unlockedBy->getName() }}
								</a>
							@else
								???
							@endif
						</div>
					@endif
				</td>
				<td>
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
					</div>
					{{ $recipe->rating }}
				</td>
				<td>
					{{-- ingredients --}}
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
				</td>
			</tr>
		@endforeach
	</tbody>
</table>