<?php
    /** @var object[] $dyeSlots */
    $slots = Helper::collect($dye_slots)->filter(function($slot) { return $slot !== null; });
    /** @var Illuminate\Support\Collection|Color[] $colors */
    $colors = Color::whereIn('id', $slots->fetch('color_id')->toArray())->get()->keyBy('id');

    $items = Item::whereIn('id', $colors->map(function($color) {
        return isset($color->getData()->item) ? $color->getData()->item : 0;
    })->toArray())->get()->keyBy('unlock_id');

?>

<div class="dyeSlots dyeSlots--{{ count($slots) }}">
    @foreach($slots as $slot)
        <?php $color = $colors->get($slot->color_id); ?>
        @if($items->has($slot->color_id))
            <?php $item = $items->get($slot->color_id); ?>
            <a class="dyeSlots__slot" style="background-color: {{ $color->getColor($slot->material) }}"
               href="{{ $item->getUrl() }}" data-item-id="{{ $item->id }}" aria-title="{{ $color->getName() }}"></a>
        @else
            <div class="dyeSlots__slot" style="background-color: {{ $color->getColor($slot->material) }}" title="{{ $color->getName() }}"></div>
        @endif
    @endforeach
</div>

<style>
    .dyeSlots { width: 64px; height: 64px; }
    .dyeSlots > .dyeSlots__slot { display: inline-block; }
    .dyeSlots--1 > .dyeSlots__slot { width: 64px; height: 64px; }

    .dyeSlots--2 > .dyeSlots__slot { width: 64px; height: 31px; float: left; }
    .dyeSlots--2 > .dyeSlots__slot:last-child { margin-top: 2px }

    .dyeSlots--3 > .dyeSlots__slot:first-child { width: 64px; height: 31px; float: left; }
    .dyeSlots--3 > .dyeSlots__slot:nth-child(n+2) { width: 31px; height: 31px; float: left; margin-top: 2px; }
    .dyeSlots--3 > .dyeSlots__slot:last-child { margin-left: 2px; }

    .dyeSlots--4 > .dyeSlots__slot { width: 31px; height: 31px; float: left; }
    .dyeSlots--4 > .dyeSlots__slot:nth-child(n+3) { margin-top: 2px; }
    .dyeSlots--4 > .dyeSlots__slot:nth-child(2n) { margin-left: 2px; }
</style>
