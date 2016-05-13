@extends('traits.fact')

@section($section.'text')
    {{ $fact->text }}: {{ $fact->distance }}
@endsection
