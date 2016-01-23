<div class="achievement__breadcrumbs">
    <a href="{{ URL::route('achievement.overview', App::getLocale()) }}#{{ $category->group->id }}">
    < {{ $category->group->getName() }}</a>
</div>
<h2>{{ $category->getIcon(32) }} {{ $category->getName() }}</h2>
<p>{{ $category->getDescription() }}</p>
<ul class="itemList">
    @foreach($category->achievements as $achievement)
        <li>{{ $achievement->link(32) }}
    @endforeach
</ul>
