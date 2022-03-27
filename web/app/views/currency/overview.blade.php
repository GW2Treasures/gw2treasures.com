<h2>{{ trans('currency.breadcrumb') }}</h2>

<style>
    .currencyList + .currencyList {
        border-top: 1px solid #eee;
        padding-top: 8px;
        margin-top: 12px;
    }
</style>

@foreach($currencies as $group)
    <ul class="itemList currencyList">
        @foreach($group as $currency)
            <li>{{ $currency->link(32) }}</li>
        @endforeach
    </ul>
@endforeach
