<!-- notifications -->
<ul id="notifications">
	@foreach( Notification::Notifications() as $n )
		@include( 'static.notification', array( 'notification' => $n ) )
	@endforeach
</ul>
