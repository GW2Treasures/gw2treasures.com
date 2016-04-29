<h2>{{ trans('wvw.region.na') }}</h2>
<table class="wvw-table">
	@include('wvw.head')
	@foreach( $matches as $match )
		@if( $match->region == Match::REGION_US )
			@include( 'wvw.smallMatchBox' )
		@endif
	@endforeach
</table>

<h2>{{ trans('wvw.region.eu') }}</h2>

<table class="wvw-table">
	@include('wvw.head')
	@foreach( $matches as $match )
		@if( $match->region == Match::REGION_EU )
			@include( 'wvw.smallMatchBox' )
		@endif
	@endforeach
</table>
