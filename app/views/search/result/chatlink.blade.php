@if($result->hasResults())
    <div class="chatlinks">
        @foreach($result->getResults() as $chatlink)
            <div class="chatlink-box">
                <h3>{{ $chatlink->encode() }}</h3>
                <div class="chatlink-box__content">
                    @if($chatlink->getType() === $chatlink::TYPE_COIN)
                        @include('search.result.chatlink.coin')
                    @elseif($chatlink->getType() === $chatlink::TYPE_ITEM)
                        @include('search.result.chatlink.item')
                    @elseif($chatlink->getType() === $chatlink::TYPE_SKIN)
                        @include('search.result.chatlink.skin')
                    @elseif($chatlink->getType() === $chatlink::TYPE_TRAIT)
                        @include('search.result.chatlink.trait')
                    @else
                        Unknown type 0x{{ substr('0'.dechex($chatlink->getType()), -2) }}
                    @endif
                </div>
            </div>
        @endforeach
    </div>
@endif
