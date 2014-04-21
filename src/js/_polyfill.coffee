# Avoid `console` errors in browsers that lack a console.
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