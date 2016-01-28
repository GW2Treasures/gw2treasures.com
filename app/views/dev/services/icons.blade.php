<h2 class="pageWidth">Icons</h2>
<section class="pageWidth">
    <div class="toc">
        <h3>Table of Contents</h3>
        <ol>
            <li><a href="#whatsWrong">Whats wrong with ArenaNets render service?</a></li>
            <li><a href="#use">Use GW2Treasures render service</a></li>
        </ol>
    </div>
    <p>
        Some basic intro text about our item service goes here...
    </p>
</section>


<h3 id="whatsWrong" class="pageWidth">Whats wrong with ArenaNets render service?</h3>
<section class="pageWidth">
    <p>
        The icons served by ArenaNets render service are not optimized. By lossless compression and discarding metadata from the images, the filesize can be reduced by over 20% on average. If you have multiple icons on a page, saving 20% of transmitted bytes means a noticeable speed improvement.
    </p>
    <p>
        Often you don't want to display a 64x64 version of the icon on your page, but by loading the big icon and downscaling it clientside you are wasting bandwith. We provide all icons in 64x64, 32x32 and 16x16, so you can pick the dimensions and are only downloading the bytes you need.
    </p>
    <p>
        As you can see our service is optimized to improve loading speed on the first and all subsequent requests.
    </p>
</section>

<h3 class="pageWidth" id="use">Use GW2Treasures render service</h3>
<section class="pageWidth">
    <p>
        We are providing thumbnails and compressed versions of all icons from ArenaNets render service. This is ideal if you use many icons or icons with smaller dimension than the default 64px. The dimensions available are 16px, 32px and 64px.
    </p>
    <p>
        The icons are available at this url:
    </p>
    <pre>https://darthmaim-cdn.de/gw2treasures/icons/<b>{signature}</b>/<b>{file_id}</b>-<b>{size}</b>.png</pre>
    <table style="width:100%" class="devTable">
        <thead><tr><th>Parameter</th><th>Explanation</th></tr></thead>
        <tbody>
            <tr><th><code>signature</code></th>
                <td>The file signature you get from the official API.</td>
            </tr>
            <tr><th><code>file_id</code></th>
                <td>The <code>file_id</code> you get from the official API.</td>
            </tr>
            <tr><th><code>size</code></th>
                <td>Valid sizes are:
                    <ul><li>64px
                        <li>32px
                        <li>16px
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
    <p>
        To load higher resolution icons for devices with "retina" screens, you can use the <code>srcset</code> attribute.
        Devices with lower resolutions, will still load the smaller file and save bandwith.
        You can read more about the <code>srcset</code> attribute on the
        <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-srcset">MDN page about the <code>img</code> element</a>.
    </p>
</section>
<div class="codeWrap" style="margin-top: 1.6em">
    <pre class="pageWidth">
        @highlight('html')
            &lt;img
                src="https://darthmaim-cdn.de/gw2treasures/icons/9D94B96446F269662F6ACC2531394A06C0E03951/947657-32px.png"
                srcset="https://darthmaim-cdn.de/gw2treasures/icons/9D94B96446F269662F6ACC2531394A06C0E03951/947657-64px.png 2x"
                width="32" height="32" alt="" crossorigin="anonymous"&gt;
        @endhighlight
    </pre>
</div>
<h3 class="pageWidth">Examples</h3>
<section class="pageWidth">
    <table style="width:100%" class="devTable">
        <thead><tr><th>Icon</th><th>URL</th></tr></thead>
        <tbody>
            <tr>
                <td><img src="https://darthmaim-cdn.de/gw2treasures/icons/18CE5D78317265000CF3C23ED76AB3CEE86BA60E/65941-64px.png" width="64" height="64" alt="">
                </td><td>
                    <code>https://darthmaim-cdn.de/gw2treasures/icons/18CE5D78317265000CF3C23ED76AB3CEE86BA60E/65941-64px.png</code>
                </td>
            </tr>
            <tr>
                <td><img src="https://darthmaim-cdn.de/gw2treasures/icons/4F19A8B4E309C3042358FB194F7190331DEF27EB/631494-32px.png" width="32" height="32" alt="">
                </td><td>
                    <code>https://darthmaim-cdn.de/gw2treasures/icons/4F19A8B4E309C3042358FB194F7190331DEF27EB/631494-32px.png</code>
                </td>
            </tr>
            <tr>
                <td><img src="https://darthmaim-cdn.de/gw2treasures/icons/027D1D382447933D074BE45F405EA1F379471DEB/63127-16px.png" width="16" height="16" alt="">
                </td><td>
                    <code>https://darthmaim-cdn.de/gw2treasures/icons/027D1D382447933D074BE45F405EA1F379471DEB/63127-16px.png</code>
                </td>
            </tr>
        </tbody>
    </table>
</section>

<h3 class="pageWidth">Sample implementations</h3>
<section class="pageWidth">
    <p>
        Here are some sample implementations for getting the url pointing to an icon of a specific size.
        All these samples require the signature (string) and the file_id (int). The size (int) is optional.
    </p>
</section>
<h4 class="pageWidth">PHP</h4>
<div class="codeWrap">
    <pre class="pageWidth">
        @highlight('php')
            function icon( $signature, $file_id, $size = 64 ) {
                if ( $size &lt;= 16 ) {
                    $size = 16;
                } elseif ( $size &lt;= 32 ) {
                    $size = 32;
                } else {
                    $size = 64;
                }

                return 'https://darthmaim-cdn.de/gw2treasures/icons/' .
                    $signature . '/' . $file_id . '-' . $size . 'px.png';
            }
        @endhighlight
    </pre>
</div>
<h4 class="pageWidth">JavaScript</h4>
<div class="codeWrap">
    <pre class="pageWidth">
        @highlight('javascript')
            function icon(signature, file_id, size) {
                if(size <= 16) {
                    size = 16;
                } elseif(size <= 32) {
                    size = 32;
                } else {
                    size = 64;
                }

                return "https://darthmaim-cdn.de/gw2treasures/icons/" +
                    signature + "/" + file_id + "-" + size + "px.png";
            };
        @endhighlight
    </pre>
</div>
