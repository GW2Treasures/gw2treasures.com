@extends('traits.fact')

@section($section.'text')
    {{ $fact->text }}: {{ $fact->duration }}s
@endsection
