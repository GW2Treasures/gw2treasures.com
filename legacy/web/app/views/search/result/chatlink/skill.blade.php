<?php
    $skillId = $chatlink->getId();

    $skill = Skill::remember(3)->find($skillId);
?>


<table class="chatlink-box__table">
    <tbody>
        <tr>
            <th>{{ trans('misc.chatlink.skill') }}</th>
            <td>
                {{ $skill !== null ? $skill->link(16) : 'Unknown skill ('.$skillId.')' }}
            </td>
        </tr>
    </tbody>
</table>

