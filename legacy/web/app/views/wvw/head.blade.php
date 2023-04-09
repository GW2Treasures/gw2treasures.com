<thead>
    <tr>
        <th class="wvw-table__worlds">{{ trans('wvw.world') }}</th>
        @foreach($columns as $column)
            <th class="wvw-table__cell wvw-table__cell--{{ $column }}">
                @if($column === 'score')
                    {{ trans('wvw.score') }}
                @elseif($column === 'income')
                    {{ trans('wvw.income') }}
                @elseif($column === 'objectives')
                    <span><svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M15 30s2-1 3-6c2 5 3 6 3 6h8s-3-3-3-13c0 0-5-2-8-8-2 6-8 8-8 8 0 10-3 13-3 13h8zm-3-8.998V24h3v-3l-3 .002zM21 24h3v-3l-3 .002V24z" fill-rule="evenodd" /></svg></span>
                    <span><svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M13 28l-1 .5V30h4v-5l2.08-1L20 25v5h4v-1.5l-1-.5v-9l1-1v-8l-6-3-6 3v8l1 1v9zm0-17h2v4.38h-2V11zm4 4.38V11h2v4.38h-2zm4 0V11h2v4.38h-2z" fill-rule="evenodd" /></svg></span>
                    <span><svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M11 17v11l-1 .5V30h6v-5l2.08-1L20 25v5h6v-1.5l-1-.5V17l2-2V9h-2v1h-2V9h-2v1h-2V9h-2v1h-2V9h-2v1h-2V9H9v6"/></svg></span>
                    <span><svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M11 28l-1 .5V30h6v-5l2.08-1L20 25v5h6v-1.5l-1-.5V18H11v10zM9 10l5 3 4-6 4 6 5-3-2 7H11l-2-7z" fill-rule="evenodd" /></svg></span>
                @elseif($column === 'victory')
                    {{ trans('wvw.victoryPoints') }}
                @elseif($column === 'skirmish')
                    {{ trans('wvw.skirmish') }}
                @endif
            </th>
        @endforeach
    </tr>
</thead>
