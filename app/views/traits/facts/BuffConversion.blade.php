@extends('traits.fact')

@section($section.'text')
    Gain {{ trans('item.attribute.'.$fact->target) }} based on a percentage of
    {{ trans('item.attribute.'.$fact->source) }}: {{ $fact->percent }}%
@endsection
