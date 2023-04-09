<?php
    /** @var Match $match */
    /** @var string $side */

    // calculate max income
    $maxIncome = max($match->getIncome(Match::TEAM_RED), $match->getIncome(Match::TEAM_GREEN), $match->getIncome(Match::TEAM_BLUE));
?>

<span class="wvw-table__label">+{{ $match->getIncome($side) }}</span>
<div class="wvw-table__bar wvw-table__bar--{{ $cssClass[$side] }}"
     style="width:{{ $maxIncome > 0 ? $match->getIncome($side) / $maxIncome * 100 : 0 }}%">&nbsp;</div>
