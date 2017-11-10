<script>
    window.gw2t = window.gw2t || {};

    (function(window, $) {
        window.gw2t.vendorValue = function(element, value) {
            element = $(element);

            var gold = Math.floor(value / 10000);
            var silver = Math.floor((value % 10000) / 100);
            var copper = value % 100;

            element.attr('data-value', value);

            var html = '';

            if(gold > 0) {
                html += '<span class="gold" title="{{ trans( 'item.gold' ) }}">' + gold + "</span>";
            }
            if(silver > 0) {
                html += '<span class="silver" title="{{ trans( 'item.silver' ) }}">' + silver + "</span>";
            }
            if(copper > 0 || value == 0) {
                html += '<span class="copper" title="{{ trans( 'item.copper' ) }}">' + copper + "</span>";
            }

            element.html(html);
        };
    })(window, jQuery);

    (function(window, $) {
        $('.sidebar-tp').each(function(_, e) {
            var $tp = $(e);

            $.ajax('https://api.guildwars2.com/v2/commerce/prices/'+$tp.data('tp-item-id'))
                .done(function(data) {
                    window.gw2t.vendorValue($tp.find('#tp-a-v'), data.sells.unit_price);
                    window.gw2t.vendorValue($tp.find('#tp-o-v'), data.buys.unit_price);

                    $tp.find('#tp-a-a').html(data.sells.quantity.toLocaleString('{{ App::getLocale() }}'));
                    $tp.find('#tp-o-a').html(data.buys.quantity.toLocaleString('{{ App::getLocale() }}'));

                    $tp.removeClass('loading');
                })
                .fail(function(response) {
                    if(response.status !== 503) {
                        window.gw2t.vendorValue($tp.find('#tp-a-v'), 0);
                        window.gw2t.vendorValue($tp.find('#tp-o-v'), 0);

                        $tp.find('#tp-a-a').html(0);
                        $tp.find('#tp-o-a').html(0);
                    } else {
                        $tp.text('{{ trans('item.api503') }}');
                    }

                    $tp.removeClass('loading');
                });
        });
    })(window, jQuery);

    [].slice.apply(document.getElementsByClassName('chatlink--inline')).forEach(function(chatlink) {
        chatlink.addEventListener('click', function(e) {
            if(e.metaKey) {
                window.location = '/search?q=' + window.encodeURIComponent(chatlink.innerHTML);
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
                var selection = window.getSelection();
                selection.empty();
                selection.addRange(range);
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
