<?php $parent = isset($trait) ? $trait : $skill; ?>
<div class="trait-fact">
    @yield($section.'image', $parent->getFactIcon(16, $fact->icon))
    @yield($section.'text', isset($fact->text) ? $fact->text : '') @yield($section.'extra')
    @if(isset($fact->requires_trait))
        <div class="trait-fact__buff">
            (Only if {{ Traits::find($fact->requires_trait)->link(16) }} is selected{{
                isset($fact->overrides) ? '; Replaces fact '.($fact->overrides + 1) : ''
            }})
        </div>
    @endif
</div>
