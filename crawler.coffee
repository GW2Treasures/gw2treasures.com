request = require 'request'
{EventEmitter} = require 'events'

matchesUrl = 'https://api.guildwars2.com/v2/wvw/matches?ids=all'

delay = (s, f) -> setTimeout f, s
repeat = (s, f) -> setInterval f, s

log = (x) -> console.log '[Crawler] ' + x

class Crawler extends EventEmitter
    start: ->
        log 'Crawler started'
        @_interval = repeat 10000, => @update()

    stop: ->
        clearInterval @_interval if @_interval
        log 'Crawler stopped'

    update: ->
        request { url: matchesUrl, json: true }, (err, response, matches) =>
            if( err || !matches.length )
                log 'Error: There was an error or empty response.'
                console.log matches
                return

            for match in matches
                match.start_time = new Date match.start_time
                match.end_time   = new Date match.end_time

            @emit 'matches', matches

            for match in matches
                @emit 'details', match, match

            return

module.exports = Crawler
