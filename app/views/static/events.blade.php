<?php $event = Config::get('gw2.event'); ?>

@if($event === 'winter')
    @include('static.events.winter')
@endif
