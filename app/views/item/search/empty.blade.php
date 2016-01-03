<h2>@lang('misc.mostViewedItems.label', ['timespan' => trans('misc.mostViewedItems.month')])</h2>

<?php
$popularItemViews = DB::table('item_views')
        ->select('item_id', DB::raw('COUNT(*) as views'))
        ->whereRaw('DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH) <= time')
        ->groupBy('item_id')
        ->orderBy(DB::raw('COUNT(*)'), 'desc')
        ->orderBy( DB::raw('MAX(time)'), 'desc')
        ->take(30)->remember(60)->get();

$popularItems = (new \Illuminate\Support\Collection($popularItemViews))->lists('item_id');
$popularItems = Item::whereIn('id', $popularItems)->with('unlocksSkin')->remember(60)->get()->getDictionary();

foreach($popularItemViews as $view) {
    $view->item = $popularItems[$view->item_id];
}
?>

<ul class="itemList">
    @foreach($popularItemViews as $view)
        <li>{{ $view->item->link(32) }}</li>
    @endforeach
</ul>
