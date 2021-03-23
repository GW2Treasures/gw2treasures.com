# webp
require ['jquery'], ($) ->
    image = new Image
    image.onerror = image.onload = (event) ->
        supportsWebp = event.type is 'load' and image.width is 1

        window.document.documentElement.className += ' ' + if supportsWebp then 'webp' else 'no-webp'

        $('noscript[data-webp]').each ( _, t ) ->
            $t = $(t)
            img = new Image
            img.src    = if supportsWebp then $t.data 'webp' else $t.data 'src'
            img.width  = $t.data 'width'
            img.height = $t.data 'height'
            img.alt    = $t.data 'alt'
            $t.replaceWith img

    image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='

# remove analytics parameter
require [], ->
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
