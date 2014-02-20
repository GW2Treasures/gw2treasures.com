<div class="filter">
	<h4>{{ trans( 'recipe.filter' ) }}</h4>
	<div class="only-js filterDisciplines">
		<?php 
			$availableDisciplines = 0;
			foreach( $recipes as $recipe ) {
				$availableDisciplines |= $recipe->disciplines;
			}

			foreach( Recipe::$DISCIPLINES as $dFlag => $discipline ) {
				$available = ($availableDisciplines & $dFlag) == $dFlag;

				if( $available ) {
					?>
						<a onClick="filter.toggle('{{ $discipline }}')" class="filterButton enabled discipline-{{ $discipline }}">
							<i class="sprite-20-{{ $discipline }}" title="{{ trans('recipe.discipline.' . $discipline ) }}"></i>
						</a>
					<?php
				} else {
					?>
						<a class="filterButton disabled discipline-{{ $discipline }}">
							<i class="sprite-20-{{ $discipline }}" title="{{ trans('recipe.discipline.' . $discipline ) }}"></i>
						</a>
					<?php
				}
			}
		?>
	</div>
	<span class="only-no-js">
		{{ trans( 'recipe.filterEnableJS' ) }}
	</span>
</div>
<table class="recipeTable">
	<thead><tr>
		<th>{{ trans( 'recipe.output' ) }}</th>
		<th>{{ trans( 'recipe.disciplines' ) }}</th>
		<th>{{ trans( 'recipe.ingredients' ) }}</th>
	</tr></thead>
	<tbody>
		@foreach( $recipes as $recipe )
			<?php
				$classes = array();
				if( $recipe->hasFlag( 'LearnedFromItem' )) {
					$classes[] = 'learnedFromItem';
				} 

				foreach( Recipe::$DISCIPLINES as $dFlag => $discipline ) {
					if( $recipe->hasDiscipline( $dFlag )) {
						$classes[] = 'discipline-' . $discipline;
					}
				}
			?>
			<tr class="{{ implode( $classes, ' ' ) }}">
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
						<?php
							foreach( Recipe::$DISCIPLINES as $dFlag => $discipline ) {
								if( $recipe->hasDiscipline( $dFlag )) {
									echo '<i class="sprite-20-' . $discipline . '" title="' . trans('recipe.discipline.' . $discipline) . '"></i>';
								}
							}
						?>
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