<ul class="itemList">
    @foreach($result->getResults() as $entry)
        <li>{{ $entry->link(32) }}</li>
    @endforeach
</ul>

{{ $result->getResults()->links() }}
