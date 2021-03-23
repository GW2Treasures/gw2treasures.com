@include('search.form')


@if($results[$type]->hasFilters())
    <span class="anchor" id="advanced"></span>
    <div class="search-filter">
        {{ Form::open(['class' => 'pageWidth']) }}
        {{ Form::hidden('q', $results[$type]->getSearchTermWithoutFilters()) }}

        <h3>Advanced Filters</h3>

        @foreach($results[$type]->getFilters() as $filter)
            <div class="search-filter__row">{{ $filter->render() }}</div>
        @endforeach
        {{ Form::submit(trans('header.search.label')) }}
        {{ Form::close() }}
    </div>

    <div class="search-filter__open pageWidth">
        <a href="#advanced">Advanced Filters<svg height="12" viewBox="0 0 24 24" width="12" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg></a>
    </div>

    <style>
        #advanced {
            margin-top: -500px;
        }
        .search-filter {
            display: none;
        }
        #advanced:target ~ .search-filter {
            display: block;
        }
        #advanced:target ~ .search-filter__open {
            display: none;
        }
        .search-filter__open {
            margin-bottom: 2em;
        }
        .search-filter__open svg {
            height: 16px;
            width: 16px;
            fill: currentColor;
            vertical-align: -4px;
        }

        .search-filter {
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }

        .search-filter__row {
            padding: 16px 0;
            display: flex;
        }

        .search-filter__row + .search-filter__row {
            border-top: 1px solid #eee;
        }

        .search-filter input,
        .search-filter select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            background: #fff;
            flex: 1;
            border-radius: 0 !important;
        }
        .search-filter label {
            min-width: 200px;
            padding: 8px 12px 8px 0;
            text-transform: capitalize;
        }
        .search-box {
            margin-bottom: 20px
        }

        .filter--range, .filter--comparison {
            flex: 1;
            display: flex;
        }
        .filter--range__sep {
            padding: 8px 12px;
        }

        .filter--comparison select {
            flex: 0 0 100px;
            margin-right: 12px;
        }
    </style>
@endif

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
