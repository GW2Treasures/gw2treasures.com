<div class="search-box">
    <div class="pageWidth">
        {{ Form::open( [ 'method' => 'GET', 'route' => ['search.results', App::getLocale(), $type ]] ) }}

        <h2>{{ trans('header.search.label') }}</h2>

        <div class="search-box__main-input clearfix">
            {{ Form::text( 'q', $query->searchTerm, ['placeholder' => trans('header.search.label'), 'class' => 'search-box__main-input__input', 'id' => 'searchInput' ]) }}
            <input type="submit" value="{{ trans('header.search.label') }}" class="search-box__main-input__button" />
        </div>
        {{ Form::close() }}

        <div class="search-box__tab-container">
            <div class="search-box__tabs clearfix">
                <span class="search-box__tabs__tab-spacer"></span>
                @foreach($results as $t => $result)
                    <a class="search-box__tabs__tab{{ $t == $type ? ' search-box__tabs__tab--active' : '' }}"
                            href="{{ route('search.results', ['lang' => App::getLocale(), 'type' => $t] + ($query->searchTerm ? ['q' => $query->searchTerm] : [])) }}">
                        <span class="search-box__tabs__tab__name">{{ trans('search.types.'.$t) }}</span>
                        @if($query->searchTerm != "" && $result->getCount())
                            <span class="search-box__tabs__tab__count">{{ $result->getCount() }}</span>
                        @endif
                    </a>
                @endforeach
                <span class="search-box__tabs__tab-spacer"></span>
            </div>
        </div>
    </div>
</div>

<script>
    document.querySelector('.search-box__tabs__tab--active').scrollIntoView();
</script>
