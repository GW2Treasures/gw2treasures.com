<h2 class="pageWidth">Embedding WvW World Stats</h2>
<section class="pageWidth">
    <p>
        You can embed a small widget with the current match details of your homeworld on your own homepage.
    </p>
    <iframe style="margin-top: 1.6em" src="{{ URL::route('wvw.world.embedded', array( 'en', 1008, 'notrack' )) }}" height="120" width="100%" frameborder="0" scrolling="no"></iframe>
    <p style="font-style: italic">
        Info: If you are still using our old domain in your embed code,
        please update it to https://gw2treasures<b>.com</b>/, in case we remove the redirect in the future.
    </p>
</section>

<h3 class="pageWidth">Parameters</h3>
<section class="pageWidth">
    <p>The URL for the widget is:</p>
    <pre>https://<b>{language}</b>.gw2treasures.com/wvw/world/<b>{world_id}</b>/embedded?style=<b>{style}</b></pre>
    <table style="width:100%" class="devTable">
        <thead>
        <tr>
            <th>Parameter</th>
            <th>Explanation</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <th><code>language</code> <span style="font-weight: normal">(optional)</span></th>
            <td>The language of the widget. Supported languages are
                <ul>
                    <li><strong>de</strong> - German
                    <li><strong>en</strong> - English
                    <li><strong>es</strong> - Spanish
                    <li><strong>fr</strong> - French
                </ul>
                If you don't provide a language, we will show the widget
                in the language of the viewer  (if supported) or fallback to english.
            </td>
        </tr>
        <tr>
            <th><code>world_id</code></th>
            <td>
                The id of the world that should be displayed. The world will be marked as homeworld.
                Check <a href="#world_ids">below</a> for a list of all worlds and their id.
            </td>
        </tr>
        <tr>
            <th><code>style</code> <span style="font-weight: normal">(optional)</span></th>
            <td>
                Valid styles are <b><code>light</code></b> and <b><code>dark</code></b>.
                The default style if not specified is <b><code>light</code></b>.
            </td>
        </tr>
        </tbody>
    </table>
</section>
<h3 class="pageWidth">Code</h3>
<section class="pageWidth">
    <p>This is the full embed code using an <code>iframe</code>. You should not change the height.</p>
</section>
<div class="codeWrap" style="margin-top: 1.6em">
    <pre class="pageWidth">
&lt;iframe src="https://<b>{language}</b>.gw2treasures.com/wvw/world/<b>{world_id}</b>/embedded?style=<b>{style}</b>" height="120" width="100%" frameborder="0" scrolling="no"&gt;&lt;/iframe&gt;</pre>
</div>
<h3 class="pageWidth" id="world_ids">World ID List</h3>
<section class="pageWidth">
    <p>This is the list of all valid world ids.</p>
    <table style="width:100%; margin-top: 1.6em" class="devTable">
        <thead>
            <tr>
                <th><code>world_id</code></th>
                <th>German</th>
                <th>English</th>
                <th>Spanish</th>
                <th>French</th>
            </tr>
        </thead>
        <tbody>
            @foreach( World::all() as $world )
                <tr>
                    <th>{{ $world->id }}</th>
                    <td>{{ $world->getName('de') }}</td>
                    <td>{{ $world->getName('en') }}</td>
                    <td>{{ $world->getName('es') }}</td>
                    <td>{{ $world->getName('fr') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</section>
