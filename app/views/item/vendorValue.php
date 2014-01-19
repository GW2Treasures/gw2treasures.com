<?php
	if( !isset($vendorValue) && isset($item) ) {
		$vendorValue = $item->value;
	}

	$gold = floor( $vendorValue / 10000);
	$silver = floor( ($vendorValue % 1000) / 100 );
	$copper = $vendorValue % 100;

	$out = '<span class="money" data-value="' . $vendorValue . '">';
	if ( $gold > 0 )
		$out .= '<span class="gold" title="' . trans( 'item.gold' ) . '">' . $gold . '</span>';
	if ( $silver > 0 )
		$out .= '<span class="silver" title="' . trans( 'item.silver' ) . '">' . $silver . '</span>';
	if ( $copper > 0 || $vendorValue == 0 )
		$out .= '<span class="copper" title="' . trans( 'item.copper' ) . '">' . $copper . '</span>';
	$out .= '</span>';

	echo $out;
