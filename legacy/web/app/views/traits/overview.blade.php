<div class="devHeader">
    <h2 class="pageWidth">{{ trans('trait.breadcrumb') }}</h2>

    {{ Form::open( [ 'method' => 'GET', 'route' => ['search.results', App::getLocale(), 'trait' ], 'class' => 'search--traits'] ) }}
    <div class="search-box__main-input clearfix pageWidth">
        {{ Form::text( 'q', '', ['placeholder' => trans('header.search.label'), 'class' => 'search-box__main-input__input', 'id' => 'searchInput' ]) }}
        <input type="submit" value="{{ trans('header.search.label') }}" class="search-box__main-input__button" />
    </div>
    {{ Form::close() }}

    <div class="stats pageWidth">
        <div class="stat">
            <div class="stat__name">{{ trans('achievement.tiers.total') }}</div>
            <div class="stat__value">{{ $traitCount }}</div>
        </div>

        <div class="stat">
            <div class="stat__name">{{ trans('trait.slot.Minor') }}</div>
            <div class="stat__value">{{ $traitMinorCount }}</div>
        </div>

        <div class="stat">
            <div class="stat__name">{{ trans('trait.slot.Major') }}</div>
            <div class="stat__value">{{ $traitMajorCount }}</div>
        </div>
    </div>
</div>

<div class="pageWidth" style="margin-top: 40px">
    <ul class="itemList">
        @foreach($professions as $profession)
            <li><a class="item-link item-link-32" href="{{ route('trait.byProfession', [App::getLocale(), $profession->id]) }}">
                {{ $profession->getBigIcon(32) }} <span class="item-link-text">{{ $profession->getName() }}</span>
            </a></li>
        @endforeach
    </ul>
</div>

<style>
    .search--traits {
        margin-bottom: 20px;
    }

    .search--traits .search-box__main-input__input {
        background: rgba(255,255,255,.1);
        color: #fff;
    }

    .search--traits .search-box__main-input__input:not(:focus) {
        border-color: transparent;
    }

    .search--traits .search-box__main-input__input::placeholder {
        color: rgba(255,255,255,.8);
    }

    .search--traits .search-box__main-input__button {
        background: rgba(255,255,255,.2);
        color: #fff;
    }
    .search--traits .search-box__main-input__button:not(:focus) {
        border-color: transparent;
    }

    .stats {
        display: flex;
    }

    .stat {
        flex: 1;
        background: rgba(255,255,255,.1);
        text-align: center;
        padding: 16px;
    }

    .stat + .stat {
        margin-left: 16px;
    }

    .stat__name {
        font-size: 18px;
    }

    .stat__value {
        font-family: Adelle, Bitter, 'Segoe UI', sans-serif;
        margin-top: 4px;
        font-size: 32px;
        letter-spacing: 1px;
    }

    @media(max-width: 680px) {
        .stats {
            flex-direction: column;
        }

        .stat + .stat {
            margin-left: 0;
            margin-top: 8px;
        }
    }
</style>
