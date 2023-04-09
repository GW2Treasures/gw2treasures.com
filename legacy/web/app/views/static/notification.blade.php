<li class="notification">
	<div class="pageWidth clearfix">
		@if ( $notification->isDismissible() )
			<a class="dismiss" href="{{ URL::route( 'hideNotification', array( 'notification' => $notification->getName(), 'return' => Request::getRequestUri() )) }}" rel="nofollow">
				{{ trans( 'notifications.dismiss' ) }}
			</a>
		@endif
		<div class="notificationContent">
			{{ trans( $notification->getContent(), $notification->getData() ) }}
		</div>
	</div>
</li>
