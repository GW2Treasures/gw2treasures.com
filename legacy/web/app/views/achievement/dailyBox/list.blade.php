<h3>{{ trans('achievement.daily.type.'.$type) }}</h3>
<ul class="itemList">
    @foreach($daily->achievements[$type] as $achievement)
        @if(isset($achievement->achievement))
            <li>
                {{ $achievement->achievement->link(32, null, $achievement->name[$language]) }}
                <span class="daily-box__level">
                    @if(isset($achievement->level) && $type !== 'fractals')
                        @lang('achievement.daily.level', [
                            'level' => $achievement->level[0] == $achievement->level[1]
                                ? $achievement->level[0]
                                : $achievement->level[0].' – '.$achievement->level[1]
                        ])
                    @endif
                    @if(isset($achievement->required_access) && !is_array($achievement->required_access))
                        @if(isset($achievement->level) && $type !== 'fractals')
                            •
                        @endif
                        {{ trans('achievement.access.condition.'.$achievement->required_access->condition, [
                            'product' => trans('achievement.access.product.'.$achievement->required_access->product)
                        ]) }}
                    @endif
                </span>
            </li>
        @endif
    @endforeach
</ul>
