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
						{{ $recipe->output->link( 32 ) }}
					@else
						<span style="font-style: italic">???</span>
					@endif

					{{-- unlocked by --}}
					@if( $recipe->hasFlag( 'LearnedFromItem' ))
						<div class="unlockedBy">
							{{ trans('recipe.unlockedBy') }}:
							@if( !is_null( $recipe->unlockedBy ) && $recipe->unlockedBy->unlock_type == 'CraftingRecipe' )
								{{ $recipe->unlockedBy->link( 16 ) }}
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
									{{ $ingredient->link( 16 ) }}
								</li>
							@endif
						@endforeach
					</ul>
				</td>
			</tr>
		@endforeach
	</tbody>
</table>