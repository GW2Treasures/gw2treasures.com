@extends('traits.fact')

@section($section.'text')
    @if($fact->text)
        {{$fact->text}}: +{{ $fact->value }}
        @if($fact->target != 'None')
            {{ trans('item.attribute.'.$fact->target) }}
        @endif
    @else
    {{ trans('item.attribute.'.$fact->target) }}: +{{ $fact->value }}
    @endif
@endsection
