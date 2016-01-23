@include('achievement.dailyBox')

<div class="pageWidth">
    <h2>{{trans('achievement.overview')}}</h2>

    @foreach($groups as $group)
        <h3>{{ $group->getName() }}</h3>
        <p>{{ $group->getDescription() }}</p>
        @foreach($group->categories as $category)
            <h4>{{ $category->getIcon(32) }} {{ $category->getName() }}</h4>
            <ul class="itemList">
                @foreach($category->achievements as $achievement)
                    <li>{{ $achievement->link(32) }}
                @endforeach
            </ul>
        @endforeach
    @endforeach
</div>
