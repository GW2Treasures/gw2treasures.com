# Avoid `console` errors in browsers that lack a console.
do ->
    noop = ->
    methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    console = (@console = @console || {})

    for method in methods
        console[method] = noop if !console[method]

define 'delay', [], ->
    ( t, cb ) -> setTimeout cb, t

# Request animation frame
define 'requestAnimationFrame', [ 'delay' ], ( delay )->
    vendors = [ 'ms', 'moz', 'webkit', 'o' ]

    requestAnimationFrame = @requestAnimationFrame

    for vendor in vendors when !requestAnimationFrame?
        requestAnimationFrame = @[ "#{ vendor }RequestAnimationFrame" ]

    if !requestAnimationFrame?
        lastTime = 0
        requestAnimationFrame = ( callback, element ) ->
            currTime = do new Date().getTime
            timeToCall = Math.max 0, 16 - ( currTime - lastTime )
            id = delay timeToCall, -> callback currTime + timeToCall
            lastTime = currTime + timeToCall
            return id

    return requestAnimationFrame
