<div class="daily-box"><div class="pageWidth">
    <header class="clearfix">
        <h2>{{ trans('achievement.daily.header') }}</h2>
        <time datetime="{{ $daily->reset->format(\Carbon\Carbon::RFC3339) }}" class="daily-box__reset">
            {{ trans('achievement.daily.reset', ['reset' => $daily->reset->diffForHumans()]) }}
        </time>
    </header>
    <div class="daily-box__content clearfix">
        @foreach(['pve', 'pvp', 'wvw'] as $type)
            <div class="daily-box__column">
                <h3>{{ trans('achievement.daily.type.'.$type) }}</h3>
                <ul class="itemList">
                    @foreach($daily->achievements->{$type} as $achievement)
                        <li>
                            {{ $achievement->achievement->link(32) }}
                            <span class="daily-box__level">Level {{ $achievement->level->min }} - {{ $achievement->level->max }}</span>
                        </li>
                    @endforeach
                </ul>
            </div>
        @endforeach
    </div>
    <div class="daily-box__completion clearfix">
        <?php $completion = Achievement::find(1840); ?>
        <div class="daily-box__completion__achievement">
            {{ $completion->link(32) }}
        </div>
        <div class="daily-box__completion__reward">
            <span class="ap ap-32">{{ $completion->getTotalPoints() }}</span>
        </div>
    </div>
</div></div>

<style>

</style>
