<?php
    /** @var Item $item */
    $data = $item->getTypeData();
    $attributes = $item->getConsumableAttributes();

    // check if this is a feast
    if(!isset($data->duration_ms) && count($attributes) == 0) {
        $recipes = $item->recipes()->get();

        // feasts have all exactly 1 recipe with 1 ingredient (the base food)
        // we want to show the consumable buff for this item
        if( count( $recipes ) == 1 && $recipes[0]->totalIngredients == 1 && $recipes[0]->type == 'Feast' ) {
            $consumable = head($recipes[0]->getIngredients());

            $data = $consumable->getTypeData();
            $attributes = $consumable->getConsumableAttributes();

            // all feasts have a duration of 3600000s
            $data->duration_ms = 3600000;
        }
    }

    $hasIcon = isset($data->icon);
    $icon = $hasIcon ? Helper::getIcon($data->icon) : null;
    $hasConsumableBuff = !empty($attributes) || $hasIcon || isset($data->name) || isset($data->duration_ms);
?>

@if($hasConsumableBuff)
    <div class="consumable-buff clearfix" style="position: relative">
        @if($hasIcon)
            <img style="position: absolute; left: 0; top: 0;" width="32" height="32"
                src="https://icons-gw2.darthmaim-cdn.com/{{ $icon->signature.'/'.$icon->file_id }}-64px.png">
        @endif

        <div class="consumable-buff__content" style="{{ $hasIcon ? 'margin-left: 40px' : '' }}">
            @if(isset($data->apply_count) && $data->apply_count > 1)
                <span>{{ $data->apply_count }}×</span>
            @endif
            @if(isset($data->name) && isset($data->duration_ms))
                {{ $data->name }} ({{ Helper::duration($data->duration_ms) }}):<br>
            @elseif(isset($data->name))
                {{ $data->name }}:<br>
            @elseif(isset($data->duration_ms))
                {{ trans( 'item.duration' ) }}: {{ Helper::duration($data->duration_ms) }}<br>
            @endif

            <dl class="attributes" style="margin-top: 4px;">
                @foreach($attributes as $attribute => $modifier)
                    @if(is_int($attribute))
                        <dt>{{ $modifier }}</dt>
                    @else
                        <dd>{{ $modifier }}</dd><dt>{{ $attribute }}</dt>
                    @endif
                @endforeach
            </dl>
        </div>
    </div>
@endif
