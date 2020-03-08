require('../config/config');

const jsons = require('./jsonsdb');
const { getChampName, getPlayerLane, getRole } = require('./switch');

const fs = require('fs');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const req = require('request');

// const rp = require('request-promise');


const sleep = require('sleep');

const needle = require('needle');
// const async = require('async');
// let region = "euw1";
// let summonerName = "Reformed Juarez";
let APIKey = process.env.FIRST_STEP;

function processAndSaveInDB(URL, body) {
    var finalJs = [];
    var options = {};
    let player = 0;
    //console.log(body)

    try {
        for (i of body.participants) {

            let rival = 0;
            let lanes = getPlayerLane(body.participants[player].timeline.lane, body.participants[player].timeline.role);
            let roles = getRole(lanes);
            let partId = (body.participantIdentities[player].participantId);

            let fin = [];

            fin.unshift({ champName: getChampName(body.participants[player].championId) })
            fin.unshift({ lanerd: lanes })
            fin.unshift({ rolerd: roles })
            fin.unshift({ gameCreation: body.gameCreation })
            fin.unshift({ gameDuration: body.gameDuration })
            fin.unshift({ queueId: body.queueId })
            fin.unshift({ gameVersion: body.gameVersion })
            fin.unshift({ seasonId: body.seasonId })
            fin.unshift({ gameId: body.gameId })

            fin.unshift(flattenObject(body.participants[player]))
            fin.unshift(flattenObject(body.participantIdentities[player]))

            try {
                fin.push({ creepsPerMinDeltas: flattenObject(body.participants[player].timeline.creepsPerMinDeltas) });
                fin.push({ xpPerMinDeltas: body.participants[player].timeline.xpPerMinDeltas });
                fin.push({ goldPerMinDeltas: body.participants[player].timeline.goldPerMinDeltas });
                fin.push({ csDiffPerMinDeltas: body.participants[player].timeline.csDiffPerMinDeltas });
                fin.push({ xpDiffPerMinDeltas: body.participants[player].timeline.xpDiffPerMinDeltas });
                fin.push({ damageTakenPerMinDeltas: body.participants[player].timeline.damageTakenPerMinDeltas });
                fin.push({ damageTakenDiffPerMinDeltas: body.participants[player].timeline.damageTakenDiffPerMinDeltas });

            } catch (e) {
                console.log('no body')
                sleep.msleep(3020);
            }
            try {
                for (i of body.participants) {
                    let laner = getPlayerLane(body.participants[rival].timeline.lane, body.participants[rival].timeline.role);
                    let roler = getRole(laner);
                    // console.log(body)
                    if (partId != body.participantIdentities[rival].participantId && roles == roler) {
                        fin.unshift({ rivalChamp: getChampName(body.participants[rival].championId) })
                    }
                    rival += 1;
                }
            } catch (e) {
                console.log('no bodya')
                sleep.msleep(720);
            }


            player += 1;

            final = Object.assign({}, ...fin);

            finalJs.push(final)

        }
        finale = Object.assign({ _id: body.gameId }, {...finalJs });
        //saveMatch(finalJs, URL.name, URL.nmro);
        if (finale != undefined || finalJs != undefined) {
            saveMatchNested(finale, finalJs, 'URL');
            console.log('inserted' + URL.nmro)
        }

        sleep.msleep(1520);

    } catch (e) {
        console.log('not inserted', e)
        sleep.msleep(1520);
    }


}

function iterator1(URL, done) {

    var finalJs = [];
    var options = {};
    let player = 0;


    needle.get(URL.url, options, async function(error, response, body) {
        if (error) { return done(error) };
        console.log(body)
        await sleep.msleep(1520);
        //console.log(body.gameId)
        processAndSaveInDB(URL, body)
        done(null);
    });


};

function noIteratior() {
    var finalJs = [];
    var options = {};
    let player = 0;
    needle.get('https://acs.leagueoflegends.com/v1/stats/game/ESPORTSTMNT01/1305999?gameHash=fc3aefc24290875d', options, function(error, response, body) {
        if (error) { return done(error) };
        finalJs = require('../jsons/matches/INF_ZWN_8tva')
        console.log(body)
            //console.log(body.gameId)
        processAndSaveInDB(URL, finalJs)
    });
}





// .then((numero) => {
//     if (numero == process.env.limit) {
//         mongoose.connection.close(function() {
//             console.log('all files saved')
//             process.exit();
//         });
//     }
// });

const saveMatch = (match, summonerName, numero) => {

    mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
        function(err, db) {
            if (err) throw err;
            var query = db.collection(`${summonerName}`);
            query.insertMany(match)
            return (numero);
        });

};


const saveMatchNested = (match, matcho, summonerName) => {

    mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
        function(err, db) {
            if (err) {
                return err
            }

            var query = db.collection(`${summonerName}_Nested`);
            query.insertOne(match);
            var quero = db.collection(`${summonerName}`);
            quero.insertMany(matcho)




        });


};

const flattenObject = (obj) => {
    const flattened = {}

    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(flattened, flattenObject(obj[key]))
        } else {
            flattened[key] = obj[key]
        }
    })

    return flattened
}

module.exports = {
    iterator1,
    noIteratior
}