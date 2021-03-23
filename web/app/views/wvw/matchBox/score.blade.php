<?php
    /** @var Match $match */
    /** @var string $side */

    // calculate max score
    $maxScore = max($match->getScore(Match::TEAM_RED), $match->getScore(Match::TEAM_GREEN), $match->getScore(Match::TEAM_BLUE));
?>

<span class="wvw-table__label">
    {{ number_format( $match->getScore($side), 0, '.', ' ' ) }}
</span>
<span class="wvw-table__bar wvw-table__bar--{{ $cssClass[$side] }}"
      style="width:{{ $maxScore > 0 ? $match->getScore($side) / $maxScore * 100 : 0 }}%">&nbsp;</span>
