@unless( Notification::IsEmpty() )

	<!-- notifications -->
	<ul id="notifications">
		@if(!Helper::isBot())
			@foreach( Notification::Notifications() as $n )
				@include( 'static.notification', array( 'notification' => $n ) )
			@endforeach
		@endif
	</ul>
	<script>
		function dismissNotification(name) {
			fetch('{{ URL::route('hideNotification', ['notification' => '']) }}/' + name);
			document.getElementById('notification-' + name).remove();

			return false;
		}
	</script>

@endunless
