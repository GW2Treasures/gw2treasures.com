trustedDomains = [
    # default gw2treasures
    'https://gw2treasures.com'
    'https://de.gw2treasures.com'
    'https://en.gw2treasures.com'
    'https://es.gw2treasures.com'
    'https://fr.gw2treasures.com'
    'https://dev.gw2treasures.com'
    # local development gw2treasures
    'http://gw2treasures.local'
    'http://de.gw2treasures.local'
    'http://en.gw2treasures.local'
    'http://es.gw2treasures.local'
    'http://fr.gw2treasures.local'
    'http://dev.gw2treasures.local'
    # trust me
    'https://storage.gw2treasures.com'
]

handleMessage = ( e ) ->
    if e.origin not in trustedDomains
        throw new Error "untrusted origin"
    data =
        try
            if typeof e.data is 'string'
                JSON.parse e.data
            else
                e.data
        catch
            e.data
    if data.storage
        if data.storage.loaded
            e.source.postMessage JSON.stringify({ storage: { loaded: true }}), e.origin
        if data.storage.key && data.storage.id
            key = data.storage.key
            value = data.storage.value || JSON.parse localStorage.getItem key
            if data.storage.value
                localStorage.setItem key, JSON.stringify value
            else if data.storage.remove
                localStorage.removeItem key
            e.source.postMessage JSON.stringify({ storage: { key, value, id: data.storage.id }}), e.origin

@addEventListener 'message', handleMessage, false
