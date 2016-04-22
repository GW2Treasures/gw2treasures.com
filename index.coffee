Crawler = require './crawler'
mysql = require 'mysql'
config = require './config.json'

db = mysql.createConnection
    host     : config.mysql.host,
    database : config.mysql.database,
    user     : config.mysql.username,
    password : config.mysql.password
db.connect()

ids = { }
getID = ( match, cb ) ->
    key = "#{match.id}_#{match.start_time}"
    return cb match, ids[ key ] if ids[ key ]

    db.query 'SELECT id FROM matches WHERE match_id = ? AND start_time = ?', [match.id, match.start_time], (err, rows) ->
        throw err if err
        if !err && rows.length == 1
            ids[ key ] = rows[0]['id']
            return cb match, ids[ key ]
        return cb match, -1

newMatch = ( match ) ->
    console.log 'new match ' + match.id
    db.query 'INSERT INTO matches (match_id, red_world_id, blue_world_id, green_world_id, start_time, end_time, data) VALUES (?,?,?,?,?,?,?)',
        [ match.id, match.worlds.red, match.worlds.blue, match.worlds.green, match.start_time, match.end_time, JSON.stringify(match) ], (err, result) ->
            throw err if err
            ids[ "#{match.id}_#{match.start_time}" ] = result.insertId
            worlds = match.all_worlds.red.concat(match.all_worlds.blue, match.all_worlds.green)
            db.query 'UPDATE worlds SET match_id = ? WHERE id IN (?)', [ result.insertId, worlds ], (err, result) ->
                throw err if err

crawler = new Crawler config.matchUrl, config.detailUrl

crawler.on 'matches', (matches) ->
    for match in matches
        getID match, (match, id) =>
            if id == -1
                newMatch match

crawler.on 'details', (match, details) ->
    getID match, (match, id) =>
        db.query 'UPDATE matches SET red_score = ?, blue_score = ?, green_score = ?, data = ? WHERE id = ?', [details.scores.red, details.scores.blue, details.scores.green, JSON.stringify(details), id], (err, result) =>
            throw err if err

crawler.start()
