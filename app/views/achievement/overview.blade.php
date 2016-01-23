@include('achievement.dailyBox')

<div class="pageWidth">
    <h2>{{trans('achievement.overview')}}</h2>

    @foreach($groups as $group)
        @if(!in_array($group->id, $hidden['groups']))
            <h3 id="{{ $group->id }}">{{ $group->getName() }}</h3>
            <p>{{ $group->getDescription() }}</p>

            <ul class="itemList">
                @foreach($group->categories as $category)
                    @if(!in_array($category->id, $hidden['categories']))
                        <li>{{ $category->link(32) }}
                    @endif
                @endforeach
            </ul>
        @endif
    @endforeach
</div>
