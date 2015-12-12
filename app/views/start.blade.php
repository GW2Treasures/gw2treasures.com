<div class="banner">
	<canvas id="snowcanvas"></canvas>

	@section('winter2015.script')
		<script src="{{ Helper::cdn('assets/js/jquery.let_it_snow.min.js') }}"></script>
		<script type="text/javascript">
			$(document).ready( function() {
				var canvas = document.getElementById('snowcanvas');
				var resizeCanvas = function() {
					var scale = window.devicePixelRatio || 1;
					var width  = canvas.offsetWidth,
							height = canvas.offsetHeight;
					if( canvas.width != width * scale || canvas.height != height * scale ) {
						canvas.width = width * scale;
						canvas.height = height * scale;
					}
				};
				resizeCanvas();
				$(window).on('resize', resizeCanvas);
				$(canvas).let_it_snow({
					speed: 0.1337,
					size: 2 * (window.devicePixelRatio || 1)
				});
			});
		</script>
	@endsection

	<div class="header">
		{{ Helper::webp( Helper::cdn('assets2/img/header_img.webp'), Helper::cdn('assets2/img/header_img.png'), 800, 150, "GW2 Treasures" ) }}
	</div>
	<div class="bannerSearch">
		{{ Form::open( array( 'method' => 'GET', 'route' => array('search', App::getLocale()), 'role' => 'search' )) }}
			<label for='mainsearch'>{{ trans('header.search.label') }}</label>
			<button type="submit" aria-label="{{ trans('header.search.label') }}"><i class="sprite-32-go"></i></button>
			<div class="bannerSearchInput">{{ Form::text( 'q', null, array( 'autofocus', 'id' => 'mainsearch', 'autocomplete' => 'off' )) }}</div>
			<div id="mainsearchAutocomplete"></div>
		{{ Form::close() }}
	</div>
</div>

<div class="pageWidth grid">
	<div class="row">
		<div class="column2">
			<h2>{{ trans('misc.recentlyViewedItems') }}</h2>
			<ul class="itemList">
				@foreach ($recentItemViews as $view)
					<li>{{ $view->item->link(32) }}</li>
				@endforeach
			</ul>
		</div>
		<div class="column2">
			<h2>{{ trans('misc.mostViewedItems.label', array( 'timespan' => trans('misc.mostViewedItems.day') )) }}</h2>
			<ul class="itemList">
				@foreach ($popularItemViews as $view)
                    <li class="itemListItem--with-info">{{ $view->item->link(32) }} <span class="itemListInfo">{{ $view->views }} Views</span></li>
                @endforeach
            </ul>
		</div>
	</div>
</div>

{{--
<h2 class="pageWidth">Statistics</h2>
<div class="pageWidth">
	<ul class="statistics">
		<li><strong>34 097</strong><em>Items</em>
		<li><strong>82</strong><em>New Items<br>in the last 7 days</em>
		<li><strong>8 532</strong><em>Recipes</em>
	</ul>
</div>
--}}

<h2 class="pageWidth">{{ trans('footer.newItems') }}</h2>
<div class="pageWidth grid">
	<div class="row">
		<div class="column2">
			<ul class="itemList">
				@for( $i = 0; $i < count( $newItems ) / 2; $i++ )
					<?php
						$item = $newItems[ $i ];
						$date_added = new \Carbon\Carbon($item->date_added);
					?>
					<li class="itemListItem--with-info">{{ $item->link(32) }} <span class="itemListInfo">{{ $date_added->diffForHumans() }}</span></li>
				@endfor
			</ul>
		</div>
		<div class="column2">
			<ul class="itemList">
				@for( $i = count( $newItems ) / 2; $i < count( $newItems ); $i++ )
					<?php
						$item = $newItems[ $i ];
						$date_added = new \Carbon\Carbon($item->date_added);
					?>
					<li class="itemListItem--with-info">{{ $item->link(32) }} <span class="itemListInfo">{{ $date_added->diffForHumans() }}</span></li>
				@endfor
			</ul>
		</div>
	</div>
</div>
