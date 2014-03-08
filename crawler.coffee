request = require 'request'
{EventEmitter} = require 'events'

delay = (s, f) -> setTimeout f, s
repeat = (s, f) -> setInterval f, s

log = (x) -> console.log '[Crawler] ' + x

class Crawler extends EventEmitter
    constructor: (@matchUrl, @detailUrl) ->

    start: ->
        log 'Crawler started'
        @getMatches()
        @updateIndex = 0
        @_interval = repeat 5000, => @updateDetails()

    stop: ->
        clearInterval @_interval if @_interval
        clearTimeout @_timeout if @_timeout
        log 'Crawler stopped'

    getMatches: ->
        log 'load matches.json'
        request { url: @matchUrl, json:true }, ( err, response, content ) =>
            if err || !content.wvw_matches?.length
                log 'Error: There was an error or empty response. Retrying in 10 seconds'
                clearTimeout @_timeout if @_timeout
                delay 10000, => @getMatches 
            @matches = []
            nearestEndTime
            for match in content.wvw_matches
                match.start_time = new Date match.start_time
                match.end_time   = new Date match.end_time
                nearestEndTime = match.end_time if !nearestEndTime || match.end_time < nearestEndTime
                @matches.push match

            clearTimeout @_timeout if @_timeout
            diff = Math.min(3600000, nearestEndTime - +new Date)

            delay diff, => @getMatches 

            @emit 'matches', @matches
            log "done (#{@matches.length}, reloading matches in #{Math.round(diff/1000/60)}m)"

    getDetails: ( match ) ->
        log 'Loading details for match ' + match.wvw_match_id
        request { url: @detailUrl + '?match_id=' +  match.wvw_match_id, json:true }, ( err, response, content ) =>
            @emit 'details', match, content

    updateDetails: ->
        @getDetails @matches[@updateIndex]
        @updateIndex++
        if @updateIndex >= @matches.length
            @updateIndex = 0

module.exports = Crawler