<h2>US</h2>
<div class="matchList">
	@foreach( $matches as $match )
		@if( $match->region == Match::REGION_US )
			@include( 'wvw.smallMatchBox' )
		@endif
	@endforeach
</div>

<h2>EU</h2>
<div class="matchList">
	@foreach( $matches as $match )
		@if( $match->region == Match::REGION_EU )
			@include( 'wvw.smallMatchBox' )
		@endif
	@endforeach
</div>