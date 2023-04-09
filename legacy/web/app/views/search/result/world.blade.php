@foreach($result->getResults() as $world)
    <h3><a href="{{ $world->getUrl() }}">{{ $world->getName() }}</a></h3>
    <?php $match = $world->matches()->current()->first(); ?>
    @if(!is_null($match))
        <table class="wvw-table">
            @include('wvw.head')
            <tbody>
                @include( 'wvw.smallMatchBox', ['homeworld' => $world])
            </tbody>
        </table>
    @endif
@endforeach

{{ $result->getResults()->links() }}
