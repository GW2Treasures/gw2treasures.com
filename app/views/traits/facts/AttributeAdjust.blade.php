@extends('traits.fact')

@section($section.'text')
    @if(isset($fact->text))
        {{$fact->text}}: +{{ $fact->value or '0' }}
        @if($fact->target != 'None')
            {{ trans('item.attribute.'.$fact->target) }}
        @endif
    @else
        {{ trans('item.attribute.'.$fact->target) }}: +{{ $fact->value or '0' }}
    @endif
@endsection
