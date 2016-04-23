<h2>US</h2>
<table class="wvw-table">
	@include('wvw.head')
	@foreach( $matches as $match )
		@if( $match->region == Match::REGION_US )
			@include( 'wvw.smallMatchBox' )
		@endif
	@endforeach
</table>

<h2>EU</h2>

<table class="wvw-table">
	@include('wvw.head')
	@foreach( $matches as $match )
		@if( $match->region == Match::REGION_EU )
			@include( 'wvw.smallMatchBox' )
		@endif
	@endforeach
</table>
