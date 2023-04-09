<table class="wvw-table">
    <thead><tr class="wvw-table__header-row"><th colspan="3">{{ trans('wvw.region.na') }}</th></tr></thead>
	@include('wvw.head')
	@foreach( $matches as $match )
		@if( $match->region == Match::REGION_US )
			@include( 'wvw.smallMatchBox' )
		@endif
	@endforeach
    <thead><tr class="wvw-table__header-row"><th colspan="3">{{ trans('wvw.region.eu') }}</th></tr></thead>
    @include('wvw.head')
	@foreach( $matches as $match )
		@if( $match->region == Match::REGION_EU )
			@include( 'wvw.smallMatchBox' )
		@endif
	@endforeach
</table>

<style>
    .wvw-table__header-row th {
        font: 20px Bitter, sans-serif;
        padding: 8px 4px;
    }
</style>
