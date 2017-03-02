<h2>
    <a href="{{ route('trait.overview', App::getLocale()) }}">{{ trans('trait.breadcrumb') }}</a>:
    <a href="{{ $profession->getUrl() }}">{{ $profession->getName() }}</a>
</h2>

@foreach($specializations as $specialization)
    <h3>{{ $specialization->link(32) }}</h3>

    @include('specialization.table')
@endforeach

<style>
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
</style>
