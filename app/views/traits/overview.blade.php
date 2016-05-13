<h2>{{ trans('trait.breadcrumb') }}</h2>

<ul class="itemList">
    @foreach($traits as $trait)
        <li>{{ $trait->link(32) }}</li>
    @endforeach
</ul>
