<div class="daily-box"><div class="pageWidth">
    <header class="clearfix">
        <h2>
            {{ trans('achievement.daily.header') }}
            <span class="daily-box__day-selector">
                <a class="{{ $tomorrow ? '' : 'active' }}" href="{{ route('achievement.overview', [App::getLocale()]) }}">{{ trans('achievement.daily.today') }}</a>
                <a class="{{ $tomorrow ? 'active' : '' }}" href="{{ route('achievement.overview', [App::getLocale(), 'dailies' => 'tomorrow']) }}">{{ trans('achievement.daily.tomorrow') }}</a>
            </span>
        </h2>
        <div class="daily-box__reset">
            @if($tomorrow)
                {{ trans('achievement.daily.start', [
                    'start' => '<time id="daily-reset-time" datetime="'.$daily->start->format(\Carbon\Carbon::RFC3339).'">'.
                        $daily->start->diff(\Carbon\Carbon::now())->format('%H:%I:%S').'</time>'
                ]) }}
            @else
                {{ trans('achievement.daily.reset', [
                    'reset' => '<time id="daily-reset-time" datetime="'.$daily->reset->format(\Carbon\Carbon::RFC3339).'">'.
                        $daily->reset->diff(\Carbon\Carbon::now())->format('%H:%I:%S').'</time>'
                ]) }}
            @endif
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
        <div class="daily-box__row clearfix">
            @include('achievement.dailyBox.list', ['type' => 'pve'])
        </div>
        <div class="daily-box__row clearfix">
            <div class="daily-box__column">
                @include('achievement.dailyBox.list', ['type' => 'pvp'])
            </div>
            <div class="daily-box__column">
                @include('achievement.dailyBox.list', ['type' => 'wvw'])
            </div>
        </div>
        <div class="daily-box__row clearfix">
            @include('achievement.dailyBox.list', ['type' => 'fractals'])
        </div>
    </div>
    <div class="daily-box__completion clearfix">
        <div class="daily-box__completion__achievement">
            {{ $daily->reward->link(32) }}
        </div>
        <div class="daily-box__completion__reward">
            <span class="ap-icon ap-icon--big">{{ $daily->reward->getTotalPoints() }} @include('achievement.icon')</span>
        </div>
    </div>
</div></div>
