<!DOCTYPE html>
<!--[if lt IE 7]>      <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="en" itemscope itemtype="http://schema.org/WebPage" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="en" itemscope itemtype="http://schema.org/WebPage" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="en" itemscope itemtype="http://schema.org/WebPage" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" lang="en" itemscope itemtype="http://schema.org/WebPage" class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <title>{{ $title }} | Dev | GW2 Treasures</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">

    <meta name="gw2treasures:domain" content="{{ Config::get('app.domain') }}">

    <meta itemprop="name" content="GW2 Treasures: The Guild Wars 2 Item Database">
    <meta itemprop="image" content="{{ Helper::cdn('assets/img/logo.png') }}">

    <!-- styles -->
    <link rel="stylesheet" href="{{ Helper::cdn('assets/css/gw2t.css').Helper::cacheBustingSuffix() }}">

    <!-- fonts -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Open+Sans+Condensed:300|Bitter:700" rel="stylesheet" type="text/css">

    <!-- favicons -->
    <link rel="icon" href="{{ Helper::cdn('assets/img/favicon.png') }}" type="image/png" />
    <link rel="shortcut icon" href="/favicon.ico" />

    <!-- other -->
    <meta name="theme-color" content="#F3E2A5">

    <!-- opensearch -->
    <link rel="search" href="{{ Request::isSecure() ? 'https' : 'http' }}://{{ Config::get('app.domain') }}/opensearch.xml" type="application/opensearchdescription+xml" title="Search">

    <!-- modernizr -->
    <script src="{{ Helper::cdn('assets/js/vendor/modernizr-3.0.0.min.js') }}"></script>
</head>
<body class="developer-body">
    <div id="wrapper">
        @include('static.header3')
        @include('static.notifications')

        <!-- content -->
        <div id="content" role="main">
            {{ $content }}
        </div>

        <!-- footer -->
        <footer id="footerBar">
            <div class="pageWidth">
                <a href="{{ URL::route('contact', App::getLocale()) }}">darthmaim</a> © {{ date('Y') }}
            </div>
        </footer>
    </div>

    <footer id="footer" class="clearfix">
        <nav role="navigation" class="pageWidth grid footerGrid">
            <div class="row">
                <div class="column4">
                    <a href="{{ URL::route('search', App::getLocale()) }}">{{ trans('footer.items') }}</a>
                    <ul>
                        <li><a href="{{ URL::route('stats.items.new', App::getLocale()) }}">{{ trans('footer.recentlyAddedItems') }}</a>
                        <li><a href="{{ URL::route('randomitem', App::getLocale()) }}">{{ trans('footer.randomItem') }}</a>
                    </ul>
                    <a href="{{ URL::route('wvw', App::getLocale()) }}">{{ trans('footer.wvw') }}</a>
                    <ul>
                        <li><a href="{{ URL::route('wvw', App::getLocale()) }}">{{ trans('footer.wvwOverview') }}</a>
                    </ul>
                </div>
                <div class="column4">
                    <a href="{{ URL::route('achievement.overview', App::getLocale()) }}">{{ trans('footer.achievements.header') }}</a>
                    <ul>
                        <li><a href="{{ URL::route('achievement.overview', App::getLocale()) }}">{{ trans('footer.achievements.overview') }}</a>
                        <li><a href="{{ URL::route('achievement.overview', App::getLocale()) }}">{{ trans('footer.achievements.daily') }}</a>
                    </ul>
                    <a href="{{ URL::route('dev') }}" class="">{{ trans('footer.developer') }}</a>
                    <ul>
                        <li><a href="{{ URL::route('dev') }}#apiDoc">{{ trans('footer.APIDocumentation') }}</a>
                    </ul>
                </div>
                <div class="column4">
                    <a href="{{ URL::route('about', App::getLocale()) }}">{{ trans('footer.about') }}</a>
                    <ul>
                        <li><a href="{{ URL::route('about', App::getLocale()) }}">{{ trans('footer.about') }}</a>
                        <li><a href="https://github.com/GW2Treasures/gw2treasures.com" target="_blank">{{ trans('footer.sourcecode') }}</a>
                        <li><a href="https://github.com/GW2Treasures/gw2treasures.com/issues" target="_blank">{{ trans('footer.bugtracker') }}</a>
                        <li><a href="{{ URL::route('contact', App::getLocale()) }}">{{ trans('footer.contact') }}</a>
                    </ul>
                </div>
                <div class="column4">
                    {{ trans('footer.language') }}
                    <ul>
                        <li><a hreflang="de" rel="alternate" href="?l=de">{{ trans('footer.german') }}</a>
                        <li><a hreflang="en" rel="alternate" href="?l=en">{{ trans('footer.english') }}</a>
                        <li><a hreflang="es" rel="alternate" href="?l=es">{{ trans('footer.spanish') }}</a>
                        <li><a hreflang="fr" rel="alternate" href="?l=fr">{{ trans('footer.french') }}</a>
                    </ul>
                </div>
            </div>
        </nav>

        <p class="pageWidth legalNotice" role="contentinfo">{{ trans('footer.legalNotice1') }}</p>
        <p class="pageWidth legalNotice" role="contentinfo">{{ trans('footer.legalNotice2') }}</p>
        <div class="pageWidth legalNotice" style="margin-top: 2em">
            <span style="float:right" title="<?php
                echo 'Runtime: ' . round(( STARTTIME + microtime( true ) ) * 1000, 2 ) . 'ms' . "\n";
                echo 'Memory usage: ' . round(memory_get_usage() / 1024 / 1024, 2) . ' MiB' . "\n";
                echo 'DB queries: ' . count(DB::getQueryLog()) . "\n";
                if( isset( $cached ) && $cached ) {
                    echo 'cached' . "\n";
                }
                if( isset( $_SERVER['HTTP_CF_CONNECTING_IP'] )) {
                    echo 'via cloudflare';
                }
            ?>">
                generated @ {{ date(DATE_RFC822) }}
            </span>
        </div>

        @if( isset($_GET['debug']) && !App::environment('production') )
            <pre class="pageWidth">
                {{ print_r(DB::getQueryLog()) }}
            </pre>
        @endif
    </footer>


    <div id="scripts">
        @if( !empty( Config::get('app.trackingCode')) )
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
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="{{ Helper::cdn('assets/js/vendor/jquery-1.10.1.min.js') }}"><\/script>')</script>

        <!-- my own js -->
        <script type="text/javascript" src="https://storage.gw2treasures.com/storage.js"></script>

        <script src="/assets/js/plugins.js"></script>
        <script src="/assets/js/main.js{{ Helper::cacheBustingSuffix() }}"></script>

        @if( isset( $_GET['nocache'] ))
            <script type="text/javascript">
                cache.clear();
            </script>
        @endif
    </div>
</body>
</html>
