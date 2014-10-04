trustedDomains = [
    # default gw2treasures
    'http://gw2treasures.de'
    'http://de.gw2treasures.de'
    'http://en.gw2treasures.de'
    'http://es.gw2treasures.de'
    'http://fr.gw2treasures.de'
    'http://dev.gw2treasures.de'
    # gw2treasures over https
    'https://gw2treasures.de'
    'https://de.gw2treasures.de'
    'https://en.gw2treasures.de'
    'https://es.gw2treasures.de'
    'https://fr.gw2treasures.de'
    'https://dev.gw2treasures.de'
    # local development gw2treasures
    'http://gw2treasures.local'
    'http://de.gw2treasures.local'
    'http://en.gw2treasures.local'
    'http://es.gw2treasures.local'
    'http://fr.gw2treasures.local'
    'http://dev.gw2treasures.local'
    # trust me
    'http://storage.gw2treasures.de'
    'https://storage.gw2treasures.de'
]

handleMessage = ( e ) ->
    if e.origin not in trustedDomains
        throw new Error "untrusted origin"
    data = JSON.parse e.data
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
