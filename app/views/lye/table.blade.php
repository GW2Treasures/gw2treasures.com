<?php $level = 'h'.(isset($level) ? $level : 3); ?>
{{'<'.$level.'>'}}
    {{ $title }} ({{ count($data->data) }})
    <small style="float:right">Last checked: {{$data->time}}</small>
{{'</'.$level.'>'}}
<p>{{ $description }}</p>
@if(isset($ids) && !empty($data->data))
    IDs: <input type="text" onfocus="this.select()" value="{{ json_encode(Helper::collect($data->data)->map(function($entry) use ($ids) { return $entry->{$ids}; })) }}">
@endif
<table class="devTable">
    <thead>
    <tr>
        @foreach($columns as $heading => $column)
            <th colspan="{{ is_array($column) ? count($column) : 1 }}">{{ $heading }}</th>
        @endforeach
    </tr>
    </thead>
    <tbody>
    @forelse($data->data as $entry)
        <tr>
        @foreach(array_flatten($columns) as $i => $column)
            {{ $i === 0 ? '<th>' : '<td>' }}
            @if(is_string($column))
                {{ $entry->{$column} }}
            @else
                {{ $column($entry) }}
            @endif
            {{ $i === 0 ? '</th>' : '</td>' }}
        @endforeach
        </tr>
    @empty
        <tr><td colspan="{{ count(array_flatten($columns)) }}" style="text-align: center">Nothing missing at the moment 🎉</td></tr>
    @endforelse
    </tbody>
</table>

