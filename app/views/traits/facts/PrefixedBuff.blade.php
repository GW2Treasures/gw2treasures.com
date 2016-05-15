@extends('traits.facts.Buff')

@section($section.'image')
    <?php $parent = isset($trait) ? $trait : $skill; ?>

    {{ $parent->getFactIcon(16, $fact->prefix->icon) }}
    {{ $parent->getFactIcon(16, $fact->icon) }}
@endsection
