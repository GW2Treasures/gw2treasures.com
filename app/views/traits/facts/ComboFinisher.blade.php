@extends('traits.fact')

@section($section.'text')
    {{ $fact->text }}: {{ $fact->finisher_type }}
@endsection

@section($section.'extra')
    ({{ $fact->percent }}%)
@endsection
