<h2>{{ trans('profession.breadcrumb') }}</h2>
<ul class="itemList">
    @foreach($professions as $profession)
        <li>{{ $profession->link(32) }}</li>
    @endforeach
</ul>

