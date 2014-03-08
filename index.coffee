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
    key = "#{match.wvw_match_id}_#{match.start_time}"
    return cb match, ids[ key ] if ids[ key ]

    db.query 'SELECT id FROM matches WHERE match_id = ? AND start_time = ?', [match.wvw_match_id, match.start_time], (err, rows) ->
        throw err if err
        if !err && rows.length == 1
            ids[ key ] = rows[0]['id']
            return cb match, ids[ key ]
        return cb match, -1

newMatch = ( match ) ->
    console.log 'new match ' + match.wvw_match_id
    db.query 'INSERT INTO matches (match_id, red_world_id, blue_world_id, green_world_id, start_time, end_time) VALUES (?,?,?,?,?,?)',
        [ match.wvw_match_id, match.red_world_id, match.blue_world_id, match.green_world_id, match.start_time, match.end_time ], (err, result) ->
            throw err if err
            ids[ "#{match.wvw_match_id}_#{match.start_time}" ] = result.insertId

crawler = new Crawler config.matchUrl, config.detailUrl

crawler.on 'matches', (matches) ->
    for match in matches
        getID match, (match, id) =>
            if id == -1
                newMatch match

crawler.on 'details', (match, details) ->
    getID match, (match, id) =>
        db.query 'UPDATE matches SET red_score = ?, blue_score = ?, green_score = ?, data = ? WHERE id = ?', [details.scores[0], details.scores[1], details.scores[2], JSON.stringify(details), id], (err, result) =>
            throw err if err

crawler.start()