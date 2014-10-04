iframeElement = document.getElementById '_storage'
iframe = undefined
if iframeElement is null
    iframeElement = document.createElement 'iframe'
    iframeElement.src = 'https://storage.gw2treasures.de/storage.html'
    iframeElement.id = '_storage'
    iframeElement.tabIndex = '-1'
    iframeElement.style.cssText = 'width:1px;height:1px;position:absolute;top:-100px'
    iframeElement.onload = ->
        iframe = iframeElement.contentWindow 
        iframe.postMessage JSON.stringify({ storage: { loaded: true }}), 'https://storage.gw2treasures.de'
    document.body.appendChild iframeElement
else
    iframe = iframeElement.contentWindow
    iframe.postMessage JSON.stringify({ storage: { loaded: true }}), 'https://storage.gw2treasures.de'

nextId = 1
_loaded = 0
registeredCallbacks = []
queue = []

handleMessage = ( e ) ->
    data = JSON.parse e.data
    if e.origin is 'https://storage.gw2treasures.de' && data.storage
        if data.storage.loaded
            _loaded++
            iframe.postMessage x, 'https://storage.gw2treasures.de' for x in queue
            enqueue = (data) ->
                data = JSON.stringify data
                iframe.postMessage data, 'https://storage.gw2treasures.de'
        else if registeredCallbacks[ data.storage.id ]
            registeredCallbacks[ data.storage.id ]? data.storage.value
            delete registeredCallbacks[ data.storage.id ]
        true
    else undefined

enqueue = ( e ) -> queue.push e

@addEventListener 'message', handleMessage, false

@storage = storage =
    put: ( key, value, cb ) ->
        id = nextId++
        registeredCallbacks[id] = cb
        data = JSON.stringify { storage: { key: key, value: value, id: id }}
        if _loaded > 0
            iframe.postMessage data, 'https://storage.gw2treasures.de'
        else
            enqueue data
    get: ( key, cb ) ->
        id = nextId++
        registeredCallbacks[id] = cb
        data = JSON.stringify { storage: { key: key, id: id }}
        if _loaded > 0
            iframe.postMessage data, 'https://storage.gw2treasures.de'
        else
            enqueue data
    remove: ( key, cb ) ->
        id = nextId++
        registeredCallbacks[id] = cb
        data = JSON.stringify { storage: { key: key, remove: true, id: id }}
        if _loaded > 0
            iframe.postMessage data, 'https://storage.gw2treasures.de'
        else
            enqueue data
