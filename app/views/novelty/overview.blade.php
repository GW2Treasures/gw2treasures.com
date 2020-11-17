<h2>{{ trans('novelty.breadcrumb') }}</h2>

@foreach($novelties as $group)
    <h3 id="{{ $group[0]->slot }}">
        {{ trans('novelty.slot.'.$group[0]->slot) }}
    </h3>

    <ul class="itemList">
        @foreach($group as $novelty)
            <li>{{ $novelty->link(32) }}</li>
        @endforeach
    </ul>
@endforeach
