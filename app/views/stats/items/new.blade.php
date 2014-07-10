<?php $lastDate = null; ?>

<style>
.itemTimeline { margin-top: 2em; }
.itemTimelineGroup { }
.itemTimelineGroupHeader {
	float: left;
	width: 100px;
	font-size: 10px;
	font-weight: 700;
	line-height: 32px;
	vertical-align: middle;
	padding: 5px 5px 0 5px;
	box-sizing: border-box;
	text-align: right;
}
.itemTimelineGroupContent {
	list-style: none;
	line-height: 32px;
	padding: 5px 5px 0 5px;
	margin: 0 0 0 100px;
	border-left: 3px solid #ccc;
}
.itemTimelineGroupContent li {
	display: inline-block;
}

.itemTimetable { position: relative; text-align: center; margin: 1em 0; padding: 1em 0; overflow-x: auto; }
.itemTimetableRow { font-size: 0; clear: both; white-space: nowrap; }
.itemTimetableCell { width: 16px; height: 16px; background: #eee; display: inline-block; margin-right: 2px; margin-bottom: 2px; }
.itemTimetableCell[data-count] { background-color: rgb(214, 230, 133) }
</style>

<div class="itemTimetable clearfix">
	@for( $y = 0; $y < 7; $y++ )
		<div class="itemTimetableRow">
			@for( $x = 1; $x <= 52; $x++ )
				@if( isset( $table[ $y ] ) && isset( $table[ $y ][ $x ] ))
					<div class="itemTimetableCell" style="background-color: rgba(42, 136, 145, {{ min( $table[ $y ][ $x ]->count / 40 * 0.7 + 0.3, 1) }}" title="{{ $table[ $y ][ $x ]->date }}{{ "\n" }}{{ $table[ $y ][ $x ]->count }} item(s)">
					</div>
				@else
					<div class="itemTimetableCell"></div>
				@endif
			@endfor
		</div>
	@endfor
</div>

<div class="itemTimeline">
	@foreach( $items as $itemGroup )
		<div class="itemTimelineGroup">
			<div class="itemTimelineGroupHeader">
				{{ $itemGroup['date']->toFormattedDateString() }}
			</div>
			<ul class="itemTimelineGroupContent">
				@foreach( $itemGroup['items'] as $item )
					<li><a data-item-id="{{ $item->id }}" href="{{ $item->getUrl() }}">{{ $item->getIcon( 32 ) }}</a></li>
				@endforeach
			</ul>
		</div>
	@endforeach
</div>