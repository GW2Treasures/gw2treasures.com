<h2>{{ trans('event.breadcrumb') }}</h2>

<ul class="itemList">
    @foreach($events as $event)
        <li>{{ $event->link(32) }}</li>
    @endforeach
</ul>

