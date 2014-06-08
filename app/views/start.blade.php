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

<h2 class="pageWidth">{{ trans('footer.changedItems') }}</h2>
<div class="pageWidth">
	<ul class="itemList">
		@foreach ($newItems as $item)
			<?php $update_time = \Carbon\Carbon::createFromTimeStamp($item->update_time) ?>
			<li style="clear:right">{{ $item->link(32) }} <span style="float:right; line-height: 32px;">{{ $update_time->diffForHumans() }}</span></li>
		@endforeach
	</ul>
</div>