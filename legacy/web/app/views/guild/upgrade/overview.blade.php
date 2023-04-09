<h2>{{ trans('guild.upgrade.breadcrumb') }}</h2>

@foreach($upgrades as $group)
    <h3 id="{{ $group[0]->type }}">
        {{ trans('guild.upgrade.type.'.$group[0]->type) }}
    </h3>

    <ul class="itemList">
        @foreach($group as $upgrade)
            <li>{{ $upgrade->link(32) }}</li>
        @endforeach
    </ul>
@endforeach
