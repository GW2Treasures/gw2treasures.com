<h3>{{ trans('achievement.daily.type.'.$type) }}</h3>
<ul class="itemList">
    @foreach($daily->achievements->{$type} as $achievement)
        @if(isset($achievement->achievement))
            <li>
                {{ $achievement->achievement->link(32) }}
                <span class="daily-box__level">
                    @if(!is_null($achievement->level))
                        @lang('achievement.daily.level', [
                            'level' => $achievement->level->min == $achievement->level->max
                                ? $achievement->level->min
                                : $achievement->level->min.' – '.$achievement->level->max
                        ])
                    @endif
                    @if(isset($achievement->required_access) && count($achievement->required_access) == 1)
                        @if(!is_null($achievement->level))
                            •
                        @endif
                        {{ trans('achievement.access.'.$achievement->required_access[0]) }}
                    @endif
                </span>
            </li>
        @endif
    @endforeach
</ul>
