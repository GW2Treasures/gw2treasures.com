<?php
    $skinId = $chatlink->getId();

    $skin = Skin::remember(3)->find($skinId);
?>


<table class="chatlink-box__table">
    <tbody>
        <tr>
            <th>{{ trans('misc.chatlink.skin') }}</th>
            <td>
                {{ $skin !== null ? $skin->link(16) : 'Unknown skin ('.$skinId.')' }}
            </td>
        </tr>
    </tbody>
</table>

