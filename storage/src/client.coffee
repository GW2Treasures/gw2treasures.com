d = ->
    url = 'https://storage.gw2treasures.com'

    postMessage = ( data, origin ) ->
        data = JSON.stringify data
        iframe.postMessage data, origin

    iframeElement = document.getElementById '_storage'
    iframe = undefined
    if iframeElement == null
        iframeElement = document.createElement 'iframe'
        iframeElement.src = url + '/storage.html'
        iframeElement.id = '_storage'
        iframeElement.tabIndex = '-1'
        iframeElement.style.cssText = 'width:1px;height:1px;position:absolute;top:-100px'
        iframeElement.onload = ->
            iframe = iframeElement.contentWindow
            postMessage { storage: { loaded: true }}, url
        document.body.appendChild iframeElement
    else
        iframe = iframeElement.contentWindow
        postMessage { storage: { loaded: true }}, url

    nextId = 1
    _loaded = 0
    registeredCallbacks = []
    queue = []

    handleMessage = ( e ) ->
        if e.origin isnt url
            return

        data =
            try
                if typeof e.data is 'string' then JSON.parse e.data else e.data
            catch
                e.data
        if data.storage
            if data.storage.loaded
                _loaded++
                postMessage x, url for x in queue
                enqueue = (data) -> postMessage data, url
            else if registeredCallbacks[ data.storage.id ]
                registeredCallbacks[ data.storage.id ]? data.storage.value
                delete registeredCallbacks[ data.storage.id ]

    enqueue = ( e ) -> queue.push e

    window.addEventListener 'message', handleMessage, false

    window.storage = storage =
        put: ( key, value, cb ) ->
            id = nextId++
            registeredCallbacks[id] = cb
            data = { storage: { key: key, value: value, id: id }}
            if _loaded > 0
                postMessage data, url
            else
                enqueue data
        get: ( key, cb ) ->
            id = nextId++
            registeredCallbacks[id] = cb
            data = { storage: { key: key, id: id }}
            if _loaded > 0
                postMessage data, url
            else
                enqueue data
        remove: ( key, cb ) ->
            id = nextId++
            registeredCallbacks[id] = cb
            data = { storage: { key: key, remove: true, id: id }}
            if _loaded > 0
                postMessage data, url
            else
                enqueue data

if typeof define is 'function' and define.amd
    define 'storage', [], d
else
    do d
