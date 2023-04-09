<div class="error-header">
    <h2 class="pageWidth"><span class="error-code">404</span> Item {{ $itemId }} not found</h2>
</div>

<article class="developer-body">
    <section class="pageWidth">
        <p>
            We couldn't find the item {{ $itemId }}. The item was probably not added to the API yet.
        </p>

        <p>
            Each item has to be whitelisted by an ArenaNet employee before it is visible in the API.
            After it has been added to the whitelist, you can find it on the
            <a href="{{ route('stats.items.new', App::getLocale()) }}">list of recently added items</a>.
        </p>

        <p>
            <?php
                $itemStack = new \GW2Treasures\GW2Tools\Common\ItemStack();
                $itemStack->id = $itemId;
                $chatlink = new \GW2Treasures\GW2Tools\Chatlinks\ItemChatlink($itemStack);
            ?>
            The chatlink for the item would be <span class="chatlink--inline">{{ $chatlink->encode() }}</span>.
        </p>
    </section>
</article>

<script>
    [].slice.apply(document.getElementsByClassName('chatlink--inline')).forEach(function(chatlink) {
        chatlink.addEventListener('click', function(e) {
            if(e.metaKey) {
                location = '/search?q=' + window.encodeURIComponent(chatlink.innerHTML);
                return;
            }

            var range;
            if (document.selection) {
                range = document.body.createTextRange();
                range.moveToElementText(chatlink);
                range.select();
            } else if (window.getSelection) {
                range = document.createRange();
                range.selectNode(chatlink);
                window.getSelection().addRange(range);
            }
            if(document.execCommand('copy')) {
                chatlink.classList.add('chatlink--inline--copied');
                setTimeout(function() {
                    chatlink.classList.remove('chatlink--inline--copied');
                }, 200);
            }
        });
    });
</script>
