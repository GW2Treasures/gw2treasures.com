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

<style>
    .search-box {
        background: #eeeeee;
        padding: 20px 0;
    }
    .search-box h2 {
        margin-top: 0;
    }
    .search-box__main-input {
        position: relative;
    }
    .search-box__main-input__input {
        float: left;
        width: calc(100% - 200px);
        min-width: 66%;

        font: inherit;
        border: none;
        padding: 8px 16px;
    }
    .search-box__main-input__button {
        float: right;
        width: 200px;
        max-width: 34%;

        font: inherit;
        background: #ddd;
        border: none;
        padding: 8px 16px;
    }
    .search-box__toggle-advanced {
        float: right;
        line-height: 26px;
    }
</style>
