@foreach($specializationsByProfession as $profession => $specializations)
    <h2>{{ trans('misc.profession.'.$profession) }}</h2>
    <ul class="itemList">
        @foreach($specializations as $specialization)
            <li>{{ $specialization->link(32) }}</li>
        @endforeach
    </ul>
@endforeach

