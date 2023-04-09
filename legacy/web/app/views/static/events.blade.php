<?php $event = Config::get('gw2.event'); ?>

@if($event === 'winter')
    @include('static.events.winter')
@elseif($event === 'halloween')
    @include('static.events.halloween')
@endif
