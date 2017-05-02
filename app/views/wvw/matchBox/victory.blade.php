<?php
    /** @var Match $match */
    /** @var string $side */

    // calculate max victory points
    $maxVictory = max($match->getVictoryPoints(Match::TEAM_RED), $match->getVictoryPoints(Match::TEAM_GREEN), $match->getVictoryPoints(Match::TEAM_BLUE));
?>

<span class="wvw-table__label">
    {{ number_format( $match->getVictoryPoints($side), 0, '.', ' ' ) }}
</span>
<span class="wvw-table__bar wvw-table__bar--{{ $cssClass[$side] }}"
      style="width:{{ $maxVictory > 0 ? $match->getVictoryPoints($side) / $maxVictory * 100 : 0 }}%">&nbsp;</span>
