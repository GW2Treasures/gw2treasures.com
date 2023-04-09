<div class="devHeader">
    <h2 class="pageWidth">Update WvW Widget Domain</h2>
</div>
<section class="pageWidth">
    <p>
        You are still using our old domain to embed our WvW widget.
    </p>
    <p>
        Even though we currently have no plans to remove our redirect from the old domain to
        the new gw2treasures.com domain, this might change in the future.
        Removing the additional redirect will also speed up the load time of the widget.
    </p>
    <p>
        For more information about using the embed code, please check our page about
        <a href="{{ route('dev.embedWorldStats') }}">embeding the WvW widget</a>.
    </p>
    <p>
        Please update your embed code as soon as possible to prevent issues in the future.
    </p>
    <p class="wvwDomainDiff">
        <code><del>gw2treasures.<mark>de</mark></del> &rarr; <ins>gw2treasures.<mark>com</mark></ins></code>
        <style>
            .wvwDomainDiff del {
                background-color: #ffecec;
                text-decoration: none;
                padding: 2px;
            }
            .wvwDomainDiff del mark {
                color: inherit;
                background-color: #f8cbcb;
                border-radius: 1px;
            }
            .wvwDomainDiff ins {
                background-color: #eaffea;
                text-decoration: none;
                padding: 2px;
            }
            .wvwDomainDiff ins mark {
                color: inherit;
                background-color: #a6f3a6;
                border-radius: 1px;
            }
        </style>
    </p>
</section>

@if(Request::has('world') && Request::has('style') && Request::has('language'))
    <h3 class="pageWidth">New embed code</h3>
    <section class="pageWidth">
        <?php $url = 'https://'.Request::get('language').'.gw2treasures<b>.com</b>/wvw/world/'.Request::get('world').'/embedded?style='.Request::get('style'); ?>
        <p>
            We generated a new embed code for your site, using the same options you were using before.
            Please make sure if you modified our original code
            to add your additional attributes (<code>class</code>, …) back.
        </p>
        <p>
            The new url four your widget is:<br>
            <code>{{ $url }}</code>
        </p>
        <p>Your new embed code:</p>
    </section>

    <div class="codeWrap">
        <pre class="pageWidth">
&lt;iframe src="{{$url}}" height="120" width="100%" frameborder="0" scrolling="no"&gt;&lt;/iframe&gt;</pre>
    </div>
@endif

