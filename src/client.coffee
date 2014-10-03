iframeElement = document.getElementById '_storage'
iframe = undefined
if iframeElement == null
    iframeElement = document.createElement 'iframe'
    iframeElement.src = 'https://storage.gw2treasures.de/storage.html'
    iframeElement.id = '_storage'
    iframeElement.tabIndex = '-1'
    iframeElement.style.cssText = 'width:1px;height:1px;position:absolute;top:-100px'
    iframeElement.onload = ->
        iframe = iframeElement.contentWindow 
        iframe.postMessage { storage: { loaded: true }}, 'https://storage.gw2treasures.de'
    document.body.appendChild iframeElement
else
    iframe = iframeElement.contentWindow
    iframe.postMessage { storage: { loaded: true }}, 'https://storage.gw2treasures.de'

nextId = 1
_loaded = 0
registeredCallbacks = []
queue = []

handleMessage = ( e ) ->
    if e.origin == 'https://storage.gw2treasures.de' && e.data.storage
        if e.data.storage.loaded
            _loaded++
            iframe.postMessage x, 'https://storage.gw2treasures.de' for x in queue
            enqueue = (data) -> iframe.postMessage data, 'https://storage.gw2treasures.de'        
        else if registeredCallbacks[ e.data.storage.id ]
            registeredCallbacks[ e.data.storage.id ]? e.data.storage.value
            delete registeredCallbacks[ e.data.storage.id ]

enqueue = ( e ) -> queue.push e

@addEventListener 'message', handleMessage, false

@storage = storage =
    put: ( key, value, cb ) ->
        id = nextId++
        registeredCallbacks[id] = cb
        data = { storage: { key: key, value: value, id: id }}
        if _loaded > 0
            iframe.postMessage data, 'https://storage.gw2treasures.de'
        else
            enqueue data
    get: ( key, cb ) ->
        id = nextId++
        registeredCallbacks[id] = cb
        data = { storage: { key: key, id: id }}
        if _loaded > 0
            iframe.postMessage data, 'https://storage.gw2treasures.de'
        else
            enqueue data
    remove: ( key, cb ) ->
        id = nextId++
        registeredCallbacks[id] = cb
        data = { storage: { key: key, remove: true, id: id }}
        if _loaded > 0
            iframe.postMessage data, 'https://storage.gw2treasures.de'
        else
            enqueue data
