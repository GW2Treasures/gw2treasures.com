Cache = require '../../src/js/cache'

# storage mockup
class Storage
    data: {}
    put: ( key, value, cb ) ->
        @data[key] = value
        cb? value
    get: ( key, cb ) ->
        cb? @data[key]
    remove: ( key, cb ) ->
        delete @data[key]
        cb?()
    reset: ->
        @data = {}

storage = new Storage()

delay = (s, cb) -> setTimeout cb, s

cache = undefined

exports.tests = tests =
    setUp: (done) ->
        cache = new Cache 'testCache', storage
        done()
    tearDown: (done) ->
        storage.reset()
        done()
    basic: (test) ->
        test.ok !!cache, 'cache is not set'
        test.done()
    put:
        basic: (test) ->
            cache.put 'key', 'value', null, (v) ->
                test.equals storage.data['cache.testCache.key'].value, 'value', 'cache stored wrong value in backend'
                test.equals v, 'value', 'callback returned wrong value'
                test.done()
        timed: (test) ->
            cache.put 'key', 'value', 42, (v) ->
                test.equals storage.data['cache.testCache.key'].seconds, Math.ceil new Date/1000 + 42, 'wrong time saved'
                test.done()
    get:
        basic: (test) ->
            cache.put 'key', 'value', 100, ->
                cache.get 'key', (v) ->
                    test.equals v, 'value', 'get returned wrong value'
                    test.done()
    remember:
        basic: (test) ->
            cache.remember 'key', 100, ->
                test.ok true
                'value'
            , (v) ->
                test.equals (cache.has 'key'), true, 'remember did not save key'
                test.equals v, 'value', 'remember callback returned wrong value'
                cache.get 'key', (v) ->
                    test.equals v, 'value', 'remember saved wrong value'
                    cache. remember 'key', 100, ->
                        test.ok false, 'remember got called a 2nd time'
                        'value2'
                    , (v) ->
                        test.equals v, 'value', 'remember callback returned wrong value on 2nd call'
                        test.done()
    has: 
        basic: (test) ->
            test.equals (cache.has 'key'), false, 'Cache.has returned true for not existing key'
            cache.put 'key', 'value', null, ->
                test.equals (cache.has 'key'), true, 'Cache.has returned false for existing key'
                test.done()
    remove:
        basic: (test) ->
            cache.put 'key', 'value', null, ->
                cache.remove 'key', (removed) ->
                    test.equals removed, true, 'remove callback returned false after removing key'
                    test.equals (cache.has 'key'), false, 'key still existing after being removed'
                    cache.remove 'key', (removed) ->
                        test.equals removed, false, 'remove callback returned true without removing key'
                        test.done()
    clear:
        basic: (test) ->
            cache.put 'key', 'value', null, ->
                cache.clear()
                test.equals (cache.has 'key'), false, 'key still exists after Cache.clear()'
                test.done()
    clean:
        basic: (test) ->
            cache.put 'key', 'value', 1, ->
                cache.clean()
                test.equals (cache.has 'key'), true, 'Cache.clean() removed still valid key'
                delay 2000, ->
                    cache.clean()
                    test.equals (cache.has 'key'), false, 'Cache.clean() did not remove invalid key'
                    test.done()
    persist: (test) ->
        cache.put 'key', 'value', 100, ->
            cache = new Cache 'testCache', storage
            test.equals (cache.has 'key'), true, 'key does not persist after creating a new cache'
            cache.get 'key', (v) ->
                test.equals v, 'value', 'restored wrong value'
                test.done()
    multipleCaches: (test) ->
        cache1 = cache
        cache2 = new Cache 'testCache2', new Storage()
        cache1.put 'key', 'value', 100, ->
            test.equals (cache1.has 'key'), true,  'key was not saved in the right cache'
            test.equals (cache2.has 'key'), false, 'key was saved in the wrong cache'
            cache2.put 'key', 'value2', 100, ->
                cache2.get 'key', (v) ->
                    test.equals v, 'value2', 'wrong value was saved in cache 2'
                    cache1.get 'key', (v) ->
                        test.equals v, 'value', 'value in cache 1 was changed when saving cache 2'
                        cache1.clear()
                        test.equals (cache2.has 'key'), true, 'key in cache 2 was removed when cleaning cache 1'
                        test.done()