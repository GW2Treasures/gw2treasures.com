<div class="achievement__breadcrumbs">
    <a href="{{ URL::route('achievement.overview', App::getLocale()) }}#{{ $category->group->id }}">
    < {{ $category->group->getName() }}</a>
</div>
<h2>{{ $category->getIcon(32) }} {{ $category->getName() }}</h2>
<p>{{ $category->getDescription() }}</p>

<?php list($current, $historic) =  $category->achievements->groupBy('historic')->toArray() + [[], []] ?>

<ul class="itemList">
    @foreach($current as $achievement)
        @if(!$achievement->historic)
            <li>{{ $achievement->link(32) }}
        @endif
    @endforeach
</ul>

@if(!empty($historic))
    <h3>Historic</h3>
    <ul class="itemList">
        @foreach($historic as $achievement)
            @if($achievement->historic)
                <li>{{ $achievement->link(32) }}
            @endif
        @endforeach
    </ul>
@endif
