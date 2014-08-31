tools =
    # use: Modernizr.on 'webp', gw2treasures.tools.webp
    webp: ( useWebp ) ->
        do ( $ = window['jQuery'] ) ->
            $('noscript[data-webp]').each ( _, t ) ->
                $t = $(t)
                img = window.document.createElement 'img'
                img.src    = if useWebp then $t.data 'webp' else $t.data 'src'
                img.width  = $t.data 'width'
                img.height = $t.data 'height'
                img.alt    = $t.data 'alt'
                $t.replaceWith img
    # use: just call it
    removeAnalyticsParameter: ->
        # https://gist.github.com/paulirish/626834
        if window.history.replaceState && /utm_/.test window.location.search
            # thx @cowboy for the revised hash param magic.
            oldUrl = window.location.href
            newUrl = oldUrl.replace /\?([^#]*)/, ( _, search ) ->
                search = search
                .split '&'
                .map ( v ) -> !/^utm_/.test(v) && v
                .filter Boolean # omg filter(Boolean) so dope.
                .join '&' 
                if search then '?' + search else ''
            if newUrl isnt oldUrl
                window.history.replaceState {}, '', newUrl
    # use: $(document).on 'click', 'a[data-outbound]', (e) -> gw2treasures.tools.outboundEvent e.target
    outboundEvent: ( a ) ->
        window.ga( 'send', 'event', 'Outbound Links', 'click', a.href );


if module?.exports
    module.exports = tools
else
    window['gw2treasures'] ?= {}
    window['gw2treasures']['tools'] ?= {}
    window['gw2treasures']['tools'][name] = func for name,func of tools