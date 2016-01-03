<div class="search-box">
    <div class="pageWidth">
        {{ Form::open( [ 'method' => 'GET', 'route' => ['search', App::getLocale() ]] ) }}

        <h2>Search</h2>

        <div class="search-box__main-input clearfix">
            {{ Form::text( 'q', $query->searchTerm, ['placeholder' => 'Search', 'class' => 'search-box__main-input__input', 'id' => 'searchInput' ]) }}
            <input type="submit" value="Search" class="search-box__main-input__button" />
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

        font: inherit;
        border: none;
        padding: 8px 16px;
    }
    .search-box__main-input__button {
        float: right;
        width: 200px;

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
