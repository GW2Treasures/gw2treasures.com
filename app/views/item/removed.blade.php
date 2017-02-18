<h2>Removed items</h2>
<ul class="itemList">
    @foreach($items as $item)
        <li>{{ $item->link(32) }}</li>
    @endforeach
</ul>
