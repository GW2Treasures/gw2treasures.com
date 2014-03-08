<h2>US</h2>
<div class="matchList">
	<div class="matchListHeader clearfix">
		<span class="server">{{ trans('wvw.server') }}</span>
		<span class="score">{{ trans('wvw.score') }}</span>
		<span class="income">{{ trans('wvw.income') }}</span>
		<span class="objectives">
			<span><i class="sprite-20-camp-gray"></i></span>
			<span><i class="sprite-20-tower-gray"></i></span>
			<span><i class="sprite-20-keep-gray"></i></span>
			<span><i class="sprite-20-castle-gray"></i></span>
		</span>
	</div>
	@foreach( $matches as $match )
		@if( $match->region == Match::REGION_US )
			@include( 'wvw.smallMatchBox' )
		@endif
	@endforeach
</div>

<h2>EU</h2>
<div class="matchList">
	<div class="matchListHeader clearfix">
		<span class="server">{{ trans('wvw.server') }}</span>
		<span class="score">{{ trans('wvw.score') }}</span>
		<span class="income">{{ trans('wvw.income') }}</span>
		<span class="objectives">
			<span><i class="sprite-20-camp-gray"></i></span>
			<span><i class="sprite-20-tower-gray"></i></span>
			<span><i class="sprite-20-keep-gray"></i></span>
			<span><i class="sprite-20-castle-gray"></i></span>
		</span>
	</div>
	@foreach( $matches as $match )
		@if( $match->region == Match::REGION_EU )
			@include( 'wvw.smallMatchBox' )
		@endif
	@endforeach
</div>