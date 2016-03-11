<table style="width: 100%">
    <tbody>
        @foreach($dropDown as $week)
            <tr>
                <td>
                    <a href="{{ route('stats.items.new', [App::getLocale(), 'date' => $week->start->format('Y-m-d')]) }}" class="date-dropdown__link {{ $start->eq($week->start) ? 'date-dropdown__link--current' : '' }}">
                        {{ $week->start->format('d.m.Y') }} <span class="date-selector__separator">–</span> {{ $week->end->format('d.m.Y') }}
                    </a>
                </td>
                <td>
                    @foreach($week->days as $count)
                        <span title="{{ $count }}" class="stat-day-box" style="opacity: {{ $count === 0 ? 0 : log($count) / log($maxPerDay) }}">&nbsp;</span>
                    @endforeach
                </td>
            </tr>
        @endforeach
    </tbody>
</table>

<style>
    .date-dropdown__link--current {
        font-weight: bold;
    }
    .stat-day-box {
        width: 16px; height: 16px;
        display: inline-block;
        float: left;
        background: #1E88E5;
    }
    .stat-day-box + .stat-day-box {
        margin-left: 4px;
    }
</style>
