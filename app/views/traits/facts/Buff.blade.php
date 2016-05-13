@extends('traits.fact')


@section($section.'text')
    {{ isset($fact->apply_count) && $fact->apply_count > 1 ? $fact->apply_count.'&times; ' : '' }}
    {{ $fact->status }}{{ isset($fact->duration) && $fact->duration > 0 ? ' ('.$fact->duration.'s)' : '' }}:
@endsection

@section($section.'extra')
    @if(isset($fact->description))
        <div class="trait-fact__buff">{{ $fact->description }}</div>
    @endif
@endsection
