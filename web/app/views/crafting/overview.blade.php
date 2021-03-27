<h2>{{ trans('crafting.breadcrumb') }}</h2>

<ul class="itemList">
    @foreach($disciplines as $discipline)
        <li>
            <a href="{{ route('crafting.details', ['lang' => App::getLocale(), '$discipline' => $discipline]) }}">
                {{ trans('recipe.discipline.'.$discipline) }}
            </a>
        </li>
    @endforeach
</ul>
