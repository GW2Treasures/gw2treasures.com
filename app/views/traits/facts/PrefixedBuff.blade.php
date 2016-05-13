@extends('traits.facts.Buff')

@section($section.'image')
    {{ $trait->getFactIcon(16, $fact->prefix->icon) }}
    {{ $trait->getFactIcon(16, $fact->icon) }}
@endsection
