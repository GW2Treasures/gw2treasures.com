<?php $rewards = $event->getRewards() ?>

<table class="table" style="width: auto">
    <tbody>
    @foreach(['gold', 'silver', 'bronze'] as $i => $tier)
        <tr>
            <th>{{ trans('event.rewards.'.$tier) }}</th>
            <td>{{ $rewards[$i * 3 + 0] }} <b>XP</b></td>
            <td>{{ $rewards[$i * 3 + 1] }} {{ $event->getKarmaIcon(16) }}</td>
            <td>@include('item.vendorValue', ['vendorValue' => $rewards[$i * 3 + 2]] )</td>
        </tr>
    @endforeach
    </tbody>
</table>
