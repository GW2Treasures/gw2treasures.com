@include('item.search.form')

<div class="pageWidth">
    @if( strlen( $query->searchTerm ) > 0 )
        @include('item.search.results')
    @else
        @include('item.search.empty')
    @endif
</div>
