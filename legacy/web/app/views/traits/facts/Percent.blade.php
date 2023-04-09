@extends('traits.fact')

@section($section.'text')
    {{ $fact->text }}: {{ $fact->percent or $fact->value }}%
@endsection
