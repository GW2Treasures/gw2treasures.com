@include('search.form')

<div class="pageWidth">
    @if( strlen( $query->searchTerm ) > 0 )
        @if($results[$type]->hasResults())
            {{ $results[$type]->render([]) }}
        @else
            {{ $results[$type]->renderEmpty([]) }}
        @endif
    @else
        @include('search.empty')
    @endif
</div>
