<!-- notifications -->
<ul id="notifications">
	@if(!Helper::isBot())
		@foreach( Notification::Notifications() as $n )
			@include( 'static.notification', array( 'notification' => $n ) )
		@endforeach
	@endif
</ul>
