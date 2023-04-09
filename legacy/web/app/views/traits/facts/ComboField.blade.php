@extends('traits.fact')

@section($section.'text')
    {{ $fact->text }}: {{ $fact->field_type }}
@endsection
