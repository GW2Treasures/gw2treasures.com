<table class="chatlink-box__table">
    <tbody>
        <tr>
            <th>{{ trans('misc.chatlink.coins') }}</th>
            <td>
                @include('item.vendorValue', ['vendorValue' => $chatlink->getCopper()])
            </td>
        </tr>
    </tbody>
</table>
