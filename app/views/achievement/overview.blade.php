@include('achievement.dailyBox')

<div class="pageWidth">
    <h2>{{trans('achievement.overview')}}</h2>

    @foreach($categories as $category)
        <h3>{{ $category->getIcon(32) }} {{ $category->getName() }}</h3>
        <ul class="itemList">
            @foreach($category->achievements as $achievement)
                <li>{{ $achievement->link(32) }}
            @endforeach
        </ul>
    @endforeach
</div>
