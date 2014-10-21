define 'cache', ['storage'], (storage) ->
    Cache = (name, storage) ->
        _name = 'globalCache'
        _storage =
        _c = {}
        _raw = (key, cb) ->
            if _c[key] == undefined
                storage.get (_key key), (x) =>
                    cb? _c[key] = new CacheObject x
            else
                cb? _c[key]
        _key = (key) ->
            "cache.#{_name}.#{key}"
        class InnerCache
            constructor: (name, storage) ->
                _name = name || 'globalCache'
                _storage = storage || window['storage']
                _c = {}
                #console.log "new cache: #{_name}"
                _storage.get "cache.#{_name}", (x) =>
                    _c[y] = undefined for y in x if x
            'put': (key, value, seconds, cb) ->
                _c[key] = new CacheObject key, value, Math.ceil new Date()/1000 + (seconds || 360)
                _storage.put "cache.#{_name}", Object.keys _c
                _storage.put (_key key), _c[key]
                cb? value
            'get': (key, cb) ->
                if @has key
                    _raw key, (raw) =>
                        if raw.seconds < new Date()/1000
                            @remove key
                            cb? undefined
                        else
                            cb? raw.value
                else
                    cb? undefined
            'remove': (key, cb) ->
                if @has key
                    _storage.remove _key key
                    delete _c[key]
                    _storage.put "cache.#{_name}", Object.keys _c
                    cb? true
                else
                    cb? false
            'remember': (key, seconds, valuecb, cb) ->
                @get key, (value) =>
                    if value == undefined
                        value = valuecb()
                        @put key, value, seconds
                    cb? value
            'has': (key) ->
                key of _c
            'clear': ->
                #console.log "clear cache: #{_name}"
                for key in Object.keys _c
                    @remove key
                return
            'clean': ->
                #console.log "clean cache: #{_name}"
                for key in Object.keys _c
                    @get key
                return

        class CacheObject
            constructor: (o, value, seconds) ->
                return null if o == null
                if o && !value && !seconds
                    @value = o.value
                    @seconds = o.seconds
                    @key = o.key
                else
                    @key = o
                    @value = value
                    @seconds = seconds

        new InnerCache name, storage
