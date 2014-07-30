<li class="notification">
	<div class="pageWidth clearfix">
		@if ( $notification->isDismissible() )
			<a class="dismiss" href="{{ URL::route( 'hideNotification', array( 'notification' => $notification->getName(), 'return' => Request::getRequestUri() )) }}">
				{{ trans( 'notifications.dismiss' ) }}
			</a>
		@endif
		<div class="notificationContent">
			{{ $notification->getContent() }}
		</div>
	</div>
</li>
