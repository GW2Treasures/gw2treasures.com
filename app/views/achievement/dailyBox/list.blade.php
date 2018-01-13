<h3>{{ trans('achievement.daily.type.'.$type) }}</h3>
<ul class="itemList">
    @foreach($daily->achievements->{$type} as $achievement)
        @if(isset($achievement->achievement))
            <li>
                {{ $achievement->achievement->link(32) }}
                <span class="daily-box__level">
                    @if(!is_null($achievement->level) && $type !== 'fractals')
                        @lang('achievement.daily.level', [
                            'level' => $achievement->level->min == $achievement->level->max
                                ? $achievement->level->min
                                : $achievement->level->min.' – '.$achievement->level->max
                        ])
                    @endif
                    @if(isset($achievement->required_access) && count($achievement->required_access) < 3)
                        @if(!is_null($achievement->level) && $type !== 'fractals')
                            •
                        @endif
                        {{ trans('achievement.access.required', [
                            'achievements' => join(', ', array_map(function($access) {
                                return trans('achievement.access.'.$access);
                            }, $achievement->required_access))
                        ]) }}
                    @endif
                </span>
            </li>
        @endif
    @endforeach
</ul>
