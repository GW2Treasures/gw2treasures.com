<!-- notifications -->
<ul id="notifications">
	@if(!str_contains(Request::header('User-Agent', ''), ['Googlebot', 'Yahoo! Slurp', 'bingbot', 'Yandex', 'DuckDuckBot']))
		@foreach( Notification::Notifications() as $n )
			@include( 'static.notification', array( 'notification' => $n ) )
		@endforeach
	@endif
</ul>
