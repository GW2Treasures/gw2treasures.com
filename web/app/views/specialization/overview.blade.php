@foreach($specializationsByProfession as $specializations)
    <h2>{{ head($specializations)->profession->link(32) }}</h2>
    <ul class="itemList">
        @foreach($specializations as $specialization)
            <li>{{ $specialization->link(32) }}</li>
        @endforeach
    </ul>
@endforeach

