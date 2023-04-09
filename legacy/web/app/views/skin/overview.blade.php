<h2>{{ trans('skin.breadcrumb') }}</h2>

@foreach($types->filter(function($type) { return $type->type !== 'Gathering'; }) as $type)
    <h3 id="{{ strtolower($type->type) }}">{{ trans( 'item.type.'.$type->type ) }}</h3>
    <ul class="itemList">
        @foreach($type->subtypes as $subtype)
            <li><a href="{{ route('skin.byType', [App::getLocale(), strtolower($type->type), strtolower($subtype->subtype)]) }}">
                <span class="skin-overview-image">
                    {{ $subtype->count }}
                </span>{{ $subtype->subtype !== 'Back' ? trans( 'item.subtype.'.$type->type.'.'.$subtype->subtype ) : trans('item.type.Back') }}</a></li>
        @endforeach
    </ul>
@endforeach

<style>
    .skin-overview-image {
        width: 32px;
        height: 32px;
        display: inline-block;
        background: #EEEEEE;
        color: #aaa;
        text-align: center;
        font-weight: bold;
        font-family: Bitter, Open Sans, sans-serif;
        margin-right: .5em;
    }
</style>
