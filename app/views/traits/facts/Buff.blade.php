@extends('traits.fact')


@section($section.'text')
    {{ isset($fact->apply_count) && $fact->apply_count > 1 ? $fact->apply_count.'&times; ' : '' }}
    {{ isset($fact->status) ? $fact->status : $fact->prefix->status }}{{ isset($fact->duration) && $fact->duration > 0 ? ' ('.$fact->duration.'s)' : '' }}:
@endsection

@section($section.'extra')
    @if(isset($fact->description) && $fact->description !== "")
        <div class="trait-fact__buff">{{ $fact->description }}</div>
    @elseif(isset($fact->prefix->description) && $fact->prefix->description !== "")
        <div class="trait-fact__buff">{{ $fact->prefix->description }}</div>
    @endif
@endsection
