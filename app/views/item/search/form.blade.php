<div class="search-box">
    <div class="pageWidth">
        {{ Form::open( [ 'method' => 'GET', 'route' => ['search', App::getLocale() ]] ) }}

        <h2>{{ trans('header.search.label') }}</h2>

        <div class="search-box__main-input clearfix">
            {{ Form::text( 'q', $query->searchTerm, ['placeholder' => trans('header.search.label'), 'class' => 'search-box__main-input__input', 'id' => 'searchInput' ]) }}
            <input type="submit" value="{{ trans('header.search.label') }}" class="search-box__main-input__button" />
        </div>
        {{ Form::close() }}
    </div>
</div>
