<!-- notifications -->
<ul id="notifications">
	@if( in_array( App::getLocale(), array( 'es', 'fr' )))
		<li class="notification"><div class="pageWidth clearfix"><div class="notificationContent">
			@if( App::getLocale() == 'es' )
				You <strong>speak spanish</strong> and want to support this project? <a href="{{ URL::route('contact', App::getLocale()) }}">Contact me now</a> to <strong>help translating</strong>!
			@else
				You <strong>speak french</strong> and want to support this project? <a href="{{ URL::route('contact', App::getLocale()) }}">Contact me now</a> to <strong>help translating</strong>!
			@endif
		</div></div></li>
	@endif
	@foreach( Notification::Notifications() as $n )
		@include( 'static.notification', array( 'notification' => $n ) )
	@endforeach
</ul>