<?php
    /** @var Match $match */

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
        @foreach($columns as $column)
            <td class="wvw-table__cell wvw-table__cell--{{$column}}">
            @if($column === 'score')
                @include('wvw.matchBox.score')
            @elseif($column === 'income')
                @include('wvw.matchBox.income')
            @elseif($column === 'objectives')
                @include('wvw.matchBox.objectives')
            @elseif($column === 'victory')
                @include('wvw.matchBox.victory')
            @elseif($column === 'skirmish')
                @include('wvw.matchBox.skirmish')
            @endif
        @endforeach
    </tr>
@endforeach
