<div class="error-header">
    <h2 class="pageWidth"><span class="error-code">404</span> Not found</h2>
</div>

<article class="developer-body">
    <section class="pageWidth">
        <p>
            We couldn't find the page you requested…
        </p>
        <p>
            <?php $search = trim(preg_replace('/[^[:alnum:]]+/iu', ' ', urldecode(Request::getPathInfo()))) ?>
            Try searching for <a href="{{ route('search', [App::getLocale(), 'q' => $search]) }}" class="button">{{ $search }}</a>
        </p>
    </section>
</article>
