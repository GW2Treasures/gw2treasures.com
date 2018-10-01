<h2>{{ trans('mount.breadcrumb') }}</h2>

<ul class="itemList">
    @foreach($mounts as $mount)
        <li>{{ $mount->link(32) }}</li>
    @endforeach
</ul>

