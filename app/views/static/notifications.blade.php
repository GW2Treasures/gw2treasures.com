<!-- notifications -->
<ul id="notifications">
	@if( App::getLocale() == 'fr' )
		<li class="notification"><div class="pageWidth clearfix"><div class="notificationContent">
			You <strong>speak french</strong> and want to support this project? <a href="{{ URL::route('contact', App::getLocale()) }}">Contact me now</a> to <strong>help translating</strong>!
		</div></div></li>
	@endif
	@foreach( Notification::Notifications() as $n )
		@include( 'static.notification', array( 'notification' => $n ) )
	@endforeach
</ul>