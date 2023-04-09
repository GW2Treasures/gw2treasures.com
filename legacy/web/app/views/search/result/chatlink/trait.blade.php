<?php
$traitId = $chatlink->getId();

$trait = Traits::remember(3)->find($traitId);
?>


<table class="chatlink-box__table">
    <tbody>
    <tr>
        <th>{{ trans('misc.chatlink.trait') }}</th>
        <td>
            {{ $trait !== null ? $trait->link(16) : 'Unknown trait ('.$traitId.')' }}
        </td>
    </tr>
    </tbody>
</table>

