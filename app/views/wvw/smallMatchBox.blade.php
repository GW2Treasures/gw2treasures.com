<?php
    /** @var Match $match */
    $maxScore  = max($match->getScore(Match::TEAM_RED), $match->getScore(Match::TEAM_GREEN), $match->getScore(Match::TEAM_BLUE));
    $maxIncome = max($match->getIncome(Match::TEAM_RED), $match->getIncome(Match::TEAM_GREEN), $match->getIncome(Match::TEAM_BLUE));

    $cssClass  = [Match::TEAM_GREEN => 'green', Match::TEAM_BLUE => 'blue', Match::TEAM_RED => 'red'];
?>
@foreach($match->worlds->groupBy(function($world) { return $world->pivot->team; }) as $side => $worlds)
    <tr class="wvw-table__row--{{ $cssClass[$side] }}">
        <td class="wvw-table__worlds">
            @for($i = 0; $i < count($worlds); $i++)
                <a href="{{ route('wvw.world', [App::getLocale(), $worlds[$i]->id]) }}"{{ isset($embedded) ? ' target="_parent"' : '' }}>
                @if(isset($homeworld) && $worlds[$i]->id == $homeworld->id)
                        <svg class="wvw-table__homeworld__icon" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M15 30v-9h6v9h7.5V18H33L18 4.5 3 18h4.5v12"/></svg>
                @endif
                {{ $worlds[$i]->getName() }}</a>{{ $i != count($worlds) - 1 ? ' / ' : '' }}
            @endfor
        </td>
        <td class="wvw-table__score">
            <span class="wvw-table__score__label">
                {{ number_format( $match->getScore($side), 0, '.', ' ' ) }}
                <span class="wvw-table__score__label__income">(+{{ $match->getIncome($side) }})</span>
            </span>
            <span class="wvw-table__score__bar wvw-table__score__bar--{{ $cssClass[$side] }}"
                  style="width:{{ $maxScore > 0 ? $match->getScore($side) / $maxScore * 100 : 0 }}%">&nbsp;</span>
        </td>
        <td class="wvw-table__income">
            <span class="wvw-table__income__label">+{{ $match->getIncome($side) }}</span>
            <div class="wvw-table__income__bar wvw-table__income__bar--{{ $cssClass[$side] }}"
                 style="width:{{ $maxIncome > 0 ? $match->getIncome($side) / $maxIncome * 100 : 0 }}%">&nbsp;</div>
        </td>
        <td class="wvw-table__objectives">
            <span>{{ $match->getObjectiveCount($side, Match::OBJECTIVE_CAMP) }}</span>
            <span>{{ $match->getObjectiveCount($side, Match::OBJECTIVE_TOWER) }}</span>
            <span>{{ $match->getObjectiveCount($side, Match::OBJECTIVE_KEEP) }}</span>
            <span>{{ $match->getObjectiveCount($side, Match::OBJECTIVE_CASTLE) }}</span>
        </td>
    </tr>
@endforeach
