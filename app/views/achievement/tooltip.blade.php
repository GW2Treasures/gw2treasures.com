<div class="tooltip">
    <header>{{ $achievement->getName() }}</header>

    <p>{{ $achievement->getData()->description }}</p>

    {{ $achievement->getData()->requirement }}

    @if(!empty($objectives))
        {{ trans_choice('achievement.tooltip.objectives', count($objectives), ['count' => count($objectives)]) }}
    @endif

    <div class="clearfix" style="margin-top: 8px">
        <span style="float: right;">
            @foreach($rewards as $reward)
                @if($reward->type === 'Item')
                    <?php $rewardItem = Item::find($reward->id); ?>
                    @if(!is_null($rewardItem))
                        <span class="achievement__reward--item">{{ ($reward->count > 1 ? $reward->count.'× ' : '').
                        $rewardItem->link(20, null, '')
                    }}</span>
                    @endif
                @elseif($reward->type === 'Mastery')
                    <span class="achievement__reward--mastery achievement__reward--mastery-{{$reward->region}}"
                        style="transform: scale(0.625); display: inline-block; height: 20px; width: 20px"></span>
                @elseif($reward->type === 'Coins')
                    <span>@include('item.vendorValue', ['vendorValue' => $reward->count])</span>
                @endif
            @endforeach
        </span>
        <span class="ap">{{ $achievement->getTotalPoints() }}</span>
    </div>
</div>
