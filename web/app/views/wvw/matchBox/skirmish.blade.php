<?php
    /** @var Match $match */
    /** @var string $side */

    // calculate max skirmish points
    $maxSkirmishScore = max($match->getLatestSkirmishPoints(Match::TEAM_RED), $match->getLatestSkirmishPoints(Match::TEAM_GREEN), $match->getLatestSkirmishPoints(Match::TEAM_BLUE));
?>

<span class="wvw-table__label">
    {{ number_format( $match->getLatestSkirmishPoints($side), 0, '.', ' ' ) }}
    <span class="wvw-table__extra">(+{{ $match->getIncome($side) }})</span>
</span>
<span class="wvw-table__bar wvw-table__bar--{{ $cssClass[$side] }}"
      style="width:{{ $maxSkirmishScore > 0 ? $match->getLatestSkirmishPoints($side) / $maxSkirmishScore * 100 : 0 }}%">&nbsp;</span>
