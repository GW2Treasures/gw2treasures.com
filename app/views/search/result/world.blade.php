@foreach($result->getResults() as $world)
    <h3><a href="{{ $world->getUrl() }}">{{ $world->getName() }}</a></h3>
    <table class="wvw-table">
        @include('wvw.head')
        <tbody>
        @include( 'wvw.smallMatchBox', array( 'match' => $world->currentMatch()->withWorlds()->first(), 'homeworld' => $world ))
        </tbody>
    </table>
@endforeach

{{ $result->getResults()->links() }}
