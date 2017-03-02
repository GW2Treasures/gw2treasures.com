<table class="table">
    <thead>
    <tr>
        <th>{{ trans('specialization.tier.1') }}</th>
        <th>{{ trans('specialization.tier.2') }}</th>
        <th>{{ trans('specialization.tier.3') }}</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        @for($i = 1; $i <= 3; $i++)
            <td>
                <ul class="itemList" style="column-count: 1">
                    @foreach($specialization->traits->sortByDesc('slot')->groupBy('tier')->get($i) as $trait)
                        <li>{{ $trait->link(32) }}</li>
                    @endforeach
                </ul>
            </td>
        @endfor
    </tr>
    @if(isset($specialization->getData()->weapon_trait))
        <tr>
            <td colspan="3">
                <ul class="itemList" style="column-count: 1">
                    <li>{{ $specialization->getTrait($specialization->getData()->weapon_trait)->link(32) }}</li>
                </ul>
            </td>
        </tr>
    @endif
    </tbody>
</table>
