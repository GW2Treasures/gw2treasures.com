const mysql = require('mysql');
const config = require('../config.json');

const matchIdCache = {};
let database;

function findMatchId(match) {
    return new Promise((resolve, reject) => {
        const matchUid = getMatchUid(match);

        if(matchIdCache[matchUid]) {
            return resolve(matchIdCache[matchUid]);
        }

        getDb().query(
            'SELECT id FROM matches WHERE match_id = ? AND start_time = ?',
            [match.id, match.start_time],
            (error, rows) => {
                if (error) {
                    return reject(error)
                } else if (rows.length  === 0) {
                    return resolve(null);
                } else if (rows.length === 1) {
                    matchIdCache[matchUid] = rows[0].id;
                    return resolve(rows[0].id);
                } else {
                    return reject(new Error('Multiple matches with same id and start time found...'));
                }
             }
        );
    });
}

function getMatchUid(match) {
    return match.id + match.start_time;
}

function insertNewMatch(match) {
    return new Promise((resolve, reject) => {
        getDb().query(
            'INSERT INTO matches (match_id, start_time, end_time, data) VALUES (?,?,?,?)',
            [match.id, match.start_time, match.end_time, JSON.stringify(match)],
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                matchIdCache[getMatchUid(match)] = result.insertId;

                return insertWorldLinkings(match, result.insertId);
            }
        );
    });
}

function insertWorldLinkings(match, matchId) {
    return new Promise((resolve, reject) => {
        getWorldsFromMatch(match).forEach(world => {
            getDb().query(
                'INSERT INTO match_worlds (match_id, world_id, team) VALUES (?,?,?)',
                [matchId, world.id, world.team]
            );
        });

        return resolve();
    });
}

function getWorldsFromMatch(match) {
    const worlds = [];

    ['red', 'green', 'blue']
        .forEach(team => match.all_worlds[team]
            .forEach(id => worlds.push({id, team})));

    return worlds;
}

function updateMatch(match) {
    return new Promise((resolve, reject) => {
        getDb().query(
            'UPDATE matches SET data=? WHERE match_id=? AND start_time=?',
            [JSON.stringify(match), match.id, match.start_time],
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                return resolve();
            }
        );
    })
}

function getDb() {
    if(!database) {
        database = mysql.createConnection(config.mysql);
        database.connect();
    }

    return database;
}

function handleError(error) {
    if(!error) {
        return true;
    }

    console.error(error);
    return false;
}

module.exports = {
    findMatchId, insertNewMatch, updateMatch
}
