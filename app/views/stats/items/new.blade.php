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
</style>

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