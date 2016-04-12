<?php
    $stack = $chatlink->getItemStack();

    $itemId = $stack->id;
    $upgradeIds = $stack->upgrades;
    $skinId = $stack->skin;

    $items = Item::remember(3)->whereIn('id', array_merge($upgradeIds, [$itemId]))->get()->keyBy('id');
    $skin = Skin::remember(3)->find($skinId);

    $item = $items->get($itemId);
?>

<table class="chatlink-box__table">
    <tbody>
        <tr>
            <th>{{ trans('misc.chatlink.item') }}</th>
            <td>
                @if($item !== null)
                    {{ $item->link(16, null, $stack->count > 1 ? $stack->count.'× '.$item->getName() : null) }}
                @else
                    Unknown ({{ $itemId }})
                @endif
            </td>
        </tr>
        @if(!empty($upgradeIds))
            <tr>
                <th>{{ trans_choice('misc.chatlink.upgrades', count($upgradeIds)) }}</th>
                <td>
                    @foreach($upgradeIds as $upgradeId)
                        <?php $upgrade = $items->get($upgradeId); ?>
                        @if($upgrade !== null)
                            {{ $upgrade->link(16) }}<br>
                        @else
                            Unknown ({{ $upgradeId }})<br>
                        @endif
                    @endforeach
                </td>
            </tr>
        @endif
        @if(isset($stack->skin))
            <tr>
                <th>{{ trans('misc.chatlink.skin') }}</th>
                <td>{{ $skin !== null ? $skin->link(16) : 'Unknown skin ('.$skinId.')' }}</td>
            </tr>
        @endif
    </tbody>
</table>
