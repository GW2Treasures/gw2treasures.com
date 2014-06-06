<div class="banner">
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

<h2 class="pageWidth">{{ trans('footer.newItems') }}</h2>
<ul class="itemList pageWidth">
	@foreach ($newItems as $item)
		<?php $date_added = new \Carbon\Carbon($item->date_added) ?>
		<li>{{ $item->link(32) }} <span style="float:right; line-height: 32px">{{ $date_added->diffForHumans() }}</span>
	@endforeach
</ul>