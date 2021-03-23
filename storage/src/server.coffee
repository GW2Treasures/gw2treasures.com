trustedOrigins = '${TRUSTED_ORIGINS},${SELF}'.split ','

handleMessage = ( e ) ->
    if e.origin not in trustedOrigins
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
