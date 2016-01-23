<div class="daily-box"><div class="pageWidth">
    <header class="clearfix">
        <h2>{{ trans('achievement.daily.header') }}</h2>
        <div class="daily-box__reset">
            {{ trans('achievement.daily.reset', [
                'reset' => '<time id="daily-reset-time" datetime="'.$daily->reset->format(\Carbon\Carbon::RFC3339).'">'.
                    $daily->reset->diff(\Carbon\Carbon::now())->format('%H:%I:%S').'</time>'
            ]) }}
        </div>
        <script>
            (function(e) {
                if(!e) return;
                function f(x) { return x<0?'00':('0'+~~(x%60)).slice(-2); }
                var d = new Date(e.getAttribute('datetime'));
                window.setInterval(function() {
                    var s = (d-new Date)/1000;
                    e.innerHTML = [s/3600,s/60,s].map(f).join(':');
                }, 1000);
            })(document.getElementById('daily-reset-time'));
        </script>
    </header>
    <div class="daily-box__content">
    @foreach([['pve', 'pvp'], ['wvw', 'fractals']] as $row)
        <div class="daily-box__row clearfix">
        @foreach($row as $type)
            <div class="daily-box__column">
                <h3>{{ trans('achievement.daily.type.'.$type) }}</h3>
                <ul class="itemList">
                    @foreach($daily->achievements->{$type} as $achievement)
                        <li>
                            {{ $achievement->achievement->link(32) }}
                            <span class="daily-box__level">
                                @if(!is_null($achievement->level))
                                    Level {{ $achievement->level->min }} - {{ $achievement->level->max }}
                                @endif
                            </span>
                        </li>
                    @endforeach
                </ul>
            </div>
        @endforeach
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
