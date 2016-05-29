@if($result->hasResults())
    <table class="table">
        <thead>
        <tr><th>Item</th><th>Type</th><th>Level</th></tr>
        </thead>
        <tbody>
        @foreach( $result->getResults() as $item )
            <tr>
                <th>{{ $item->link(32) }}</th>
                <td>
                    @if( isset( $item->getTypeData()->type ) )
                        {{ trans( 'item.type.' . $item->type ) }} ({{ trans( 'item.subtype.' . $item->type . '.' . $item->getTypeData()->type ) }})<br>
                    @elseif( $item->sub_type != '')
                        {{ trans( 'item.type.' . $item->type ) }} ({{ trans( 'item.subtype.' . $item->type . '.' . $item->subtype ) }})<br>
                    @else
                        {{ trans( 'item.type.' . $item->type ) }}<br>
                    @endif
                </td>
                <td>{{ $item->getData()->level }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    {{ $result->getResults()->links() }}
@else
    No matching items found.
@endif
