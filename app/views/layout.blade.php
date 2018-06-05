<!DOCTYPE html>
<!--[if lt IE 7]>      <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="{{ App::getLocale() }}" itemscope itemtype="http://schema.org/WebSite" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="{{ App::getLocale() }}" itemscope itemtype="http://schema.org/WebSite" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="{{ App::getLocale() }}" itemscope itemtype="http://schema.org/WebSite" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="{{ App::getLocale() }}" itemscope itemtype="http://schema.org/WebSite" class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <title>{{ $title }} | GW2 Treasures</title>
    <meta name="description" content="{{ str_limit(isset($metaDescription) ? $metaDescription : 'GW2 Treasures: The Guild Wars 2 Item Database', 160, '…') }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">

    <meta name="gw2treasures:domain" content="{{ Config::get('app.domain') }}">

    <meta itemprop="url" content="//{{ Config::get('app.domain') }}/">
    <meta itemprop="name" content="GW2 Treasures: The Guild Wars 2 Item Database">
    <meta itemprop="alternateName" content="GW2 Treasures">
    <meta itemprop="image" content="{{ Helper::cdn('assets/img/logo.png') }}">

    <!-- prefetch -->
    @foreach( Helper::$cdn_servers as $cdn_server )
    {{-- cdn --}}<link rel="dns-prefetch" href="{{ $cdn_server }}">
    @endforeach
    {{-- storage    --}}<link rel="dns-prefetch" href="//storage.gw2treasures.com">
    {{-- opensearch --}}<link rel="dns-prefetch" href="//gw2treasures.com">
    {{-- font files --}}<link rel="dns-prefetch" href="//fonts.gstatic.com">
    {{-- font css   --}}<link rel="dns-prefetch" href="//fonts.googleapis.com">
    {{-- analytics  --}}<link rel="dns-prefetch" href="//www.google-analytics.com">
    {{-- jquery     --}}<link rel="dns-prefetch" href="//ajax.googleapis.com">

    <!-- styles -->
    <link rel="stylesheet" href="{{ Helper::cdn('assets/css/normalize.min.css') }}">
    @if( App::environment('production') )
        <link rel="stylesheet" href="{{ Helper::cdn('assets2/css/gw2t.css').Helper::cacheBustingSuffix() }}">
    @else
        {{--<link rel="stylesheet" href="//direct.darthmaim-cdn.de/gw2treasures/assets2/css/gw2t.css">--}}
        <link rel="stylesheet" href="//{{ Config::get('app.domain') }}:8080/css/gw2t.css">
    @endif

    <!-- fonts -->
    <link href="//fonts.googleapis.com/css?family=Open+Sans:400,700|Open+Sans+Condensed:300|Bitter:700" rel="stylesheet" type="text/css">

    <!-- favicons -->
    <link rel="icon" href="{{ Helper::cdn('assets/img/favicon.png') }}" type="image/png" />
    <link rel="shortcut icon" href="/favicon.ico" />

    <!-- other -->
    <meta name="theme-color" content="#F3E2A5">

    <!-- opensearch -->
    <link rel="search" href="//{{ Config::get('app.domain') }}/opensearch.xml" type="application/opensearchdescription+xml" title="Search">

    <!-- modernizr -->
    <script src="{{ Helper::cdn('assets/js/vendor/modernizr-3.0.0.min.js') }}"></script>

    <!-- twitter -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="{{ '@gw2treasures' }}">
    <meta name="twitter:title" content="{{ $metaTitle or $title }}">
    <meta name="twitter:description" content="{{ $metaDescription or '' }}">
    <meta name="twitter:image:src" content="{{ $metaImage or Helper::cdn('assets/img/logo.png') }}">
    <meta name="twitter:domain" content="{{ Config::get('app.domain') }}">

    <!-- opengraph / facebook -->
    <meta property="og:title" content="{{ $metaTitle or $title }}">
    <meta property="og:site_name" content="GW2 Treasures">
    <meta property="og:url" content="{{ Request::url() }}">
    <meta property="og:description" content="{{ $metaDescription or '' }}">
    <meta property="og:image" content="{{ $metaImage or Helper::cdn('assets/img/logo.png') }}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="{{ [ 'de'=>'de_DE', 'en'=>'en_US', 'es'=>'es_ES', 'fr'=>'fr_FR' ][App::getLocale()] }}">

    <!-- alternate versions in different languages -->
    <link rel="alternate" hreflang="x-default" href="//{{    Config::get('app.domain') . Request::getRequestUri() }}" />
    <link rel="alternate" hreflang="de"        href="//de.{{ Config::get('app.domain') . Request::getRequestUri() }}" />
    <link rel="alternate" hreflang="en"        href="//en.{{ Config::get('app.domain') . Request::getRequestUri() }}" />
    <link rel="alternate" hreflang="es"        href="//es.{{ Config::get('app.domain') . Request::getRequestUri() }}" />
    <link rel="alternate" hreflang="fr"        href="//fr.{{ Config::get('app.domain') . Request::getRequestUri() }}" />

    <!-- canonical url -->
    @if( isset( $canonical ) )
        <link rel="canonical" href="{{ $canonical }}" />
    @endif
</head>
<body>
    <div id="wrapper">
        @include('static.header3')
        @include('static.notifications')

        <!-- content -->
        <div id="content" role="main">
            <div class="{{ isset( $fullWidth ) && $fullWidth === true ? '' : 'pageWidth' }}">
            {{ $content }}
            </div>
        </div>

        <!-- footer -->
        <footer id="footerBar">
            <div class="pageWidth">
                <a href="{{ URL::route('contact', App::getLocale()) }}">darthmaim</a> © {{ date('Y') }}
            </div>
        </footer>
    </div>

    @include('static.footer')

    <div id="scripts">
        @if( App::environment('production') )
            <!-- google analytics -->
            <script>
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

                ga('create', '{{ Config::get('app.trackingCode') }}', '{{ Config::get('app.domain') }}');
                ga('send', 'pageview', { transport: 'beacon' });
            </script>
        @endif

        <!-- jQuery -->
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="{{ Helper::cdn('assets/js/vendor/jquery-1.10.1.min.js') }}"><\/script>')</script>

        <!-- my own js -->
        <script type="text/javascript" src="https://storage.gw2treasures.com/storage.js"></script>

        @if( App::environment('production') )
            <script src="{{ Helper::cdn('assets/js/plugins.js') }}"></script>
            <script src="{{ Helper::cdn('assets/js/main.js').Helper::cacheBustingSuffix() }}"></script>
        @else
            <script src="//direct.darthmaim-cdn.de/gw2treasures/assets/js/plugins.js"></script>
            <script src="//direct.darthmaim-cdn.de/gw2treasures/assets/js/main.js"></script>
        @endif

        @if( isset( $_GET['nocache'] ))
            <script type="text/javascript">
                cache.clear();
            </script>
        @endif

        @include('static.scripts')
    </div>
</body>
</html>
