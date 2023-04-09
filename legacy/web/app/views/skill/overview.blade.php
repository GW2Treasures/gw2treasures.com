<h2>{{ trans('skill.breadcrumb') }}</h2>
<ul class="itemList">
    @foreach($skills as $skill)
        <li>{{ $skill->link(32) }}</li>
    @endforeach
</ul>

