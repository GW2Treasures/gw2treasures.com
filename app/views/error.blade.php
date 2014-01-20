<!DOCTYPE html>
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="{{ App::getLocale() }}" class="error">
<head>
    <meta charset="utf-8">
	<title>{{ $title or 'error' }} | GW2 Treasures</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <style type="text/css">
    	html, body { 
    		margin: 0;
    		padding: 0;
    		text-align: center;
    		font: 20px/1.2 Open Sans, sans-serif; }
    	html {
    		background: white;
    		background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%,rgba(213, 213, 213, 1) 100%);
			min-height: 100%; }
    	#wrapper {
    		transition: all .3s;
    		position: relative;
    		display: inline-block;
    		min-width: 600px;
    		padding-left: 600px;
    		min-height: 512px;
    		margin: 200px 100px 20px 100px;
    		max-width: 1400px; }
    	#wrapper > img {
    		transition: all .3s;
    		position: absolute;
    		left: 0; top: 0; }
    	#wrapper > h1 {
    		transition: all .3s;
    		font: 222px/1.2 Yanone Kaffeesatz, sans-serif;
    		margin: 0;
    		color: #222;
    		text-align: left; }
    	#wrapper > .content {
    		text-align: left; }
    	@media (max-width: 1500px) {
    		#wrapper {
    			padding-left: 300px; }
		  	#wrapper > img {
		  		margin-top: 64px;
		   		width: 256px;
		   		height: 256px; }
		  	#wrapper > h1 {
		   		font-size: 150px; }
		}
		@media (max-width: 1000px) {
    		#wrapper {
    			padding-left: 0px; }
		  	#wrapper > img {
		   		position: static; }
		}
		@media (max-width: 850px) {
    		#wrapper {
    			min-width: 256px; }
		  	#wrapper > h1 {
		   		font-size: 100px; }
		}
		@media (max-height: 850px) {
    		#wrapper {
    			margin-top: 100px; }
		}

    </style>
    <link href='http://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:400|Open+Sans:400' rel='stylesheet' type='text/css'>
</head>
<body>
	<div id="wrapper">
		<h1>{{ $title or 'error' }}</h1>
		<div class="content">{{ $description or 'Something went wrong.' }}</div>
		<img src="//gw2treasures.de/img/logo.png" alt="" width="512" height="512">
	</div>
</body>
</html>