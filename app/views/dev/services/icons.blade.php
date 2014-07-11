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
		The icons served by ArenaNets render service are not optimized. By lossless compression and discarding metadata from the images, the filesize can be reduced by over 20% on average. If you have multiple icons on a page, saving 20% of transmitted bytes means a noticable speed improvement.
	</p>
	<p>
		ArenaNets render service doesn't set caching headers on their images, so clients can't save the icon for later requests. Our icon service is using clientside caching, so the browser can save the icons locally and instantly show the icons on subsequent pageviews, without needing to request it again.
	</p>
	<p>
		Often you don't want to display a 64x64 version of the icon on your page, but by loading the big icon and downscaling it clientside you are wasting bandwith. We provide all icons in 64x64, 32x32 and 16x16, so you can pick the dimensions and are only downloading the bytes you need.
	</p>
	<p>
		Browsers limit the amount of concurrent connections to a server, so the icons from ArenaNets render service have to be loaded sequential. By serving the icons on 6 different cookieless subdomains and having optimized our servers for many concurrent connections, your browser can load the images much faster.
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
	<pre>http://<b>{subdomain}</b>.darthmaim-cdn.de/gw2treasures/icons/<b>{signature}</b>/<b>{file_id}</b>-<b>{size}</b>.png</pre>
	<table style="width:100%" class="devTable">
		<thead><tr><th>Parameter</th><th>Explanation</th></tr></thead>
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
</section>
<h3 class="pageWidth">Examples</h3>
<section class="pageWidth">
	<table style="width:100%" class="devTable">
		<thead><tr><th>Icon</th><th>URL</th></tr></thead>
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
				$subdomains = array('callisto', 'europa', 'ganymede', 'io', 'titan', 'triton');

				if ( $size &lt;= 16 ) {
					$size = 16; 
				} elseif ( $size &lt;= 32 ) {
					$size = 32;
				} else { 
					$size = 64;
				}

				return $subdomains[ $file_id % count( $subdomains ) ] . '.darthmaim-cdn.de/gw2treasures/icons/' .
					$signature . '/' . $file_id . '-' . $size . 'px.png';
			}
		@endhighlight
	</pre>
</div>
<h4 class="pageWidth">CoffeeScript</h4>
<div class="codeWrap">
	<pre class="pageWidth">
		@highlight('coffeescript')
			icon = ( signature, file_id, size ) -&gt;
				subdomains = ['callisto', 'europa', 'ganymede', 'io', 'titan', 'triton']

				size = switch
					when size &lt;= 16 then 16
					when size &lt;= 32 then 32
					else 64

				"#{ subdomains[ file_id % subdomains.length ] }.darthmaim-cdn.de/gw2treasures/icons/\
				 #{ signature }/#{ file_id }-#{ size }px.png"
		@endhighlight
	</pre>
</div><h4 class="pageWidth">JavaScript</h4>
<div class="codeWrap">
	<pre class="pageWidth">
		@highlight('javascript')
			icon = function(signature, file_id, size) {
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
				
				return "" + subdomains[file_id % subdomains.length] + ".darthmaim-cdn.de/gw2treasures/icons/" +
					signature + "/" + file_id + "-" + size + "px.png";
			};
		@endhighlight
	</pre>
</div>
<h3 class="pageWidth">Disclaimer</h3>
<section class="pageWidth">
	<p>
		Everything documented here may change at any given point without any advance notice. All icons provided by this service are property of ArenaNet. GW2 Treasures is not responsible for the availability and correctness of this service. For more details see <a href="#">API License Agreement</a>.
	</p>
</section>