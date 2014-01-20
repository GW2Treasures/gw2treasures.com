<li class="notification">
	<div class="pageWidth clearfix">
		<div class="notificationContent">
			{{ $notification->getContent() }}
		</div>
		@if ( $notification->isDismissible() )
			<a class="dismiss" href="{{ URL::route( 'hideNotification', $notification->getName() ) }}">{{ trans( 'notifications.dismiss' ) }}</a>
		@endif
	</div>
</li>