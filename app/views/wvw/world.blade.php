<h2>{{ $world->getName() }}</h2>

<table class="wvw-table">
	@include('wvw.head')
	<tbody>
		@include( 'wvw.smallMatchBox', array( 'match' => $world->currentMatch()->withWorlds()->first(), 'homeworld' => $world ))
	</tbody>
</table>

<p style="margin-top: 2em; font-size: 10px">
Embedding: <code>{{ URL::route( 'wvw.world.embedded', array( App::getLocale(), $world->id )) }}</code> (<a href="{{ URL::route('dev.embedWorldStats') }}">Info</a>)
</p>
