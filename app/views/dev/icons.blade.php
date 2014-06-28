<h2 class="pageWidth">Icons</h2>
<p class="pageWidth">
	We are providing thumbnails and compressed versions of all icons from ArenaNets render service. This is ideal if you use many icons or icons with smaller dimension than the default 64px. The dimensions available are 16px, 32px and 64px.
</p>
<p class="pageWidth">
	The icons are available at this url:
</p>
<pre class="pageWidth centered">http://<b>{subdomain}</b>.darthmaim-cdn.de/gw2treasures/icons/<b>{signature}</b>/<b>{file_id}</b>-<b>{size}</b>.png</pre> 
<div class="pageWidth">
	<table style="width:100%" class="devTable">
		<thead><tr><th>Parameter</th><th>Explanation</th></tr></theader>
		<tbody>
			<tr><th><code>subdomain</code></th>
				<td>We are serving the icons from multiple subdomains. To benefit from caching you should always use the same subdomain for the same icon. The subdomains available are:
					<ul><li>callisto
						<li>europa
						<li>ganymede
						<li>io
						<li>titan
						<li>triton
					</ul>
				Take a look at the sample implementations to see how to select a subdomain based on the <code>file_id</code>.</td>
			</tr>
			<tr><th><code>signature</code></th>
				<td>The file signature you get from the official item_details-API.</td>
			</tr>
			<tr><th><code>file_id</code></th>
				<td>The <code>file_id</code> you get from the official item_details-API.</td>
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
</div>
<h3 class="pageWidth">Examples</h3>
<div class="pageWidth">
	<table style="width:100%" class="devTable">
		<thead><tr><th>Icon</th><th>URL</th></tr></theader>
		<tbody>
			<tr>
				<td><img src="http://europa.darthmaim-cdn.de/gw2treasures/icons/18CE5D78317265000CF3C23ED76AB3CEE86BA60E/65941-64px.png" width="64" height="64" alt="">
				</td><td>
					<code>http://europa.darthmaim-cdn.de/gw2treasures/icons/18CE5D78317265000CF3C23ED76AB3CEE86BA60E/65941-64px.png</code>
				</td>
			</tr>
			<tr>
				<td><img src="http://callisto.darthmaim-cdn.de/gw2treasures/icons/4F19A8B4E309C3042358FB194F7190331DEF27EB/631494-32px.png" width="32" height="32" alt="">
				</td><td>
					<code>http://callisto.darthmaim-cdn.de/gw2treasures/icons/4F19A8B4E309C3042358FB194F7190331DEF27EB/631494-32px.png</code>
				</td>
			</tr>
			<tr>
				<td><img src="http://europa.darthmaim-cdn.de/gw2treasures/icons/027D1D382447933D074BE45F405EA1F379471DEB/63127-16px.png" width="16" height="16" alt="">
				</td><td>
					<code>http://europa.darthmaim-cdn.de/gw2treasures/icons/027D1D382447933D074BE45F405EA1F379471DEB/63127-16px.png</code>
				</td>
			</tr>
		</tbody>
	</table>
</div>

<h3 class="pageWidth">Sample implementations</h3>
<p class="pageWidth">
	Here are some sample implementations for getting the url pointing to an icon of a specific size.
	All these samples require the signature (string) and the file_id (int). The size (int) is optional.
</p>
<h4 class="pageWidth">PHP</h4>
<div class="codeWrap">
	<pre class="pageWidth">function icon( $signature, $file_id, $size = 64 ) {
    $subdomains = array('callisto', 'europa', 'ganymede', 'io', 'titan', 'triton');
    
    if( !in_array( $size, array( 16, 32, 64) )) {
            if ( $size &lt;= 16 ) { $size = 16; }
        elseif ( $size &lt;= 32 ) { $size = 32; }
        else                   { $size = 64; }
    }

    return $subdomains[ $file_id % count( $subdomains ) ] . '.darthmaim-cdn.de/gw2treasures/icons/' . $signature . '/' . $file_id . '-' . $size . 'px.png';
}</pre>
</div>
<h4 class="pageWidth">CoffeeScript</h4>
<div class="codeWrap">
	<pre class="pageWidth">icon = ( signature, file_id, size ) ->
    subdomains = ['callisto', 'europa', 'ganymede', 'io', 'titan', 'triton'];

    size = switch
        when size &lt;= 16 then 16
        when size &lt;= 32 then 32
        else 64

      "#{subdomains[ file_id % subdomains.length ]}.darthmaim-cdn.de/gw2treasures/icons/#{ signature }/#{ file_id }-#{ size }px.png"
      </pre>
</div><h4 class="pageWidth">JavaScript</h4>
<div class="codeWrap">
	<pre class="pageWidth">icon = function(signature, file_id, size) {
    var subdomains;
    subdomains = ['callisto', 'europa', 'ganymede', 'io', 'titan', 'triton'];
    size = (function() {
        switch (false) {
          case !(size &lt;= 16):
            return 16;
          case !(size &lt;= 32):
            return 32;
          default:
            return 64;
        }
    })();
    return "" + subdomains[file_id % subdomains.length] + ".darthmaim-cdn.de/gw2treasures/icons/" + signature + "/" + file_id + "-" + size + "px.png";
};</pre>
</div>
<h3 class="pageWidth">Disclaimer</h3>
<p class="pageWidth" style="text-style:italic">
	Everything documented here may change at any given point without any advance notice. All icons provided by this service are property of ArenaNet. GW2 Treasures is not responsible for the availability and correctness of this service. For more details see <a href="#">API License Agreement</a>.
</p>