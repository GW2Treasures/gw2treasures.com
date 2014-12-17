<div class="banner">
    <canvas id="snowcanvas"></canvas>
	<div class="header">
		{{ Helper::webp( Helper::cdn('assets/img/header_img.webp'), Helper::cdn('assets/img/header_img.png'), 800, 150, "GW2 Treasures" ) }}
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
			<h2>Recently viewed Items</h2>
			<ul class="itemList">
				@foreach ($recentItemViews as $view)
					<li>{{ $view->item->link(32) }}</li>
				@endforeach
			</ul>
		</div>
		<div class="column2">
			<h2>Most viewed Items</h2>
			<ul class="itemList">
				@foreach ($popularItemViews as $view)
					<li style="clear:right">{{ $view->item->link(32) }} <span style="float:right; line-height: 32px; white-space: nowrap;">{{ $view->views }} Views</span></li>
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
					<li style="clear:right">{{ $item->link(32) }} <span style="float:right; line-height: 32px; white-space: nowrap;">{{ $date_added->diffForHumans() }}</span></li>
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
					<li style="clear:right">{{ $item->link(32) }} <span style="float:right; line-height: 32px; white-space: nowrap;">{{ $date_added->diffForHumans() }}</span></li>
				@endfor
			</ul>
		</div>
	</div>
</div>
