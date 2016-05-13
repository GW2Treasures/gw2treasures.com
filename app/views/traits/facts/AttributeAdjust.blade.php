@extends('traits.fact')

@section($section.'text')
    +{{ $fact->value }} {{ trans('item.attribute.'.$fact->target) }}
@endsection
