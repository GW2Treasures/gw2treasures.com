<div class="summer-2021-banner">
    <div class="pageWidth">
        <h2>{{ trans('summer2021.title') }}</h2>
    </div>
</div>

<div class="summer-2021-timeline">
    <div class="clearfix pageWidth">
        @foreach($events as $i => $event)
            @unless($i >= 1 && $event['date']->equalTo($events[$i - 1]['date']))
                <div class="summer-2021-date summer-2021--{{ $event['type'] }}">
                    <div>
                        <div>{{ $event['date']->day }}</div>
                        <div>{{ $event['date']->shortLocaleMonth }}</div>
                    </div>
                </div>
            @endunless
            <div class="summer-2021-box summer-2021--{{ $event['type'] }}" id="{{ $event['key'] }}">
                <div class="summer-2021-box__content">
                    <?php
                        $key = $event['key'];
                        $descriptions = explode('\n', trans('summer2021.events.'.$event['key'].'.description'));
                    ?>
                    <h3>{{ trans('summer2021.events.'.$key.'.title') }}</h3>
                    @foreach($descriptions as $description)
                        <p>{{ $description }}</p>
                    @endforeach
                    @if($key === '2021-5-11-skills-balance')
                        <a href="https://www.guildwars2.com/{{ App::getLocale() }}/news/game-update-notes-may-11-2021/" rel="noopener noreferrer">{{ trans('summer2021.events.'.$key.'.link') }}</a>
                    @endif
                    @if($key === '2021-5-14-wvw' || $key === '2021-6-18-wvw' || $key === '2021-7-23-wvw')
                        <a href="{{ URL::route('wvw', App::getLocale()) }}">{{ trans('header.wvw') }}</a>
                    @endif
                    @if($key === '2021-5-25-living-world')
                        <?php $achievements = Achievement::remember(60)->whereIn('id', [5773, 5804, 5829])->get(); ?>
                        <ul class="itemList">
                            @foreach($achievements as $achievement)
                                <li>{{ $achievement->link(32) }}</li>
                            @endforeach
                        </ul>
                    @endif
                    @if($key === '2021-6-1-fractals')
                        {{ AchievementCategory::remember(60)->find(88)->link(32) }}
                    @endif
                    @if($key === '2021-6-22-dragon-bash')
                        {{ AchievementCategory::remember(60)->find(232)->link(32) }}
                    @endif
                    @if($key === '2021-7-5-pvp-tournament')
                        <a href="{{ URL::route('search.results', [App::getLocale(), 'item', 'q' => 'type:Weapon rarity:Legendary']) }}">{{ trans('summer2021.events.'.$key.'.link') }}</a>
                    @endif
                    @if($key === '2021-7-27-eod')
                        <a href="https://www.twitch.tv/guildwars2" rel="noopener noreferrer">Twitch Livestream</a>
                    @endif
                </div>
            </div>
        @endforeach
    </div>
</div>
