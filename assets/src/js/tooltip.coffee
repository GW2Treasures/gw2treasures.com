define 'tooltip', [ 'jquery', 'requestAnimationFrame' ], ( $, requestAnimationFrame ) ->
    currentElement = null

    $tooltip = $('<div/>').attr 'id', 'tooltip'
    $('body')
    .prepend $tooltip
    .on 'mousemove', ( e ) ->
        requestAnimationFrame -> mousemove e.pageX, e.pageY

    mousemove = ( x, y ) ->
        $tooltip.css 'transform', "translate3d(#{ x }px, #{ y }px, 0)"


    ( selector, callback ) ->


define 'itemtooltip', [ 'tooltip', 'cache', 'config', 'jquery' ], ( tooltip, cache, config, $ ) ->
    tooltip.add 'a[data-item-id]', ( element, callback ) ->
        $element = $ element
        itemID   = $element.data 'item-id'
        ck       = cacheKey itemID
        language = $element.attr 'hreflang' ? config.lang
        if cache.has ck
            cache.get ck, ( data ) ->
                callback data
        else
            loadTooltip itemID, language, ( data ) ->
                callback data


    loadTooltip = ( id, lang, callback ) ->
        $.get "//#{ lang }.#{ config.domain }/item/#{ id }/tooltip", ( data ) ->
            ck = cacheKey id
            cache.put ck, data, 360
            callback data


    cacheKey = ( id ) -> "tooltip:#{ config.lang }:#{ id }"
