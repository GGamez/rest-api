require('../config/config');

const rp = require('request-promise');
const fs = require('fs');
const req = require('request');

// let region = "euw1";
// let summonerName = "Reformed Juarez";
let APIKey = process.env.FIRST_STEP;

function requestMatches(url) {

    return new Promise(function(res, reject) {

        req(url, function(res, e, body) {

            if (e) return reject(e);

            try {
                res(JSON.parse(JSON.parse(body)));
            } catch (e) {
                reject(e);
            }
        });
    });
}

const cargarUserDb = (summonerName) => {

    try {
        userInfo = require(`../jsons/players/${summonerName}_Data.json`);
    } catch (error) {
        userInfo = []
    }

}
const getUserDb = (summonerName) => {

    cargarUserDb(summonerName);

    return userInfo;

}
const getUserIdDb = (summonerName) => {

    let user = getUserDb(summonerName);

    let accountId = user.accountId;

    return accountId;
}



const cargarMatchesDb = (summonerName) => {

    try {
        listadoMatches = require(`../jsons/matches/${summonerName}_Matches.json`);
    } catch (error) {
        listadoMatches = []
    }

}
const getMatchesDb = (summonerName) => {

    cargarMatchesDb(summonerName);

    return listadoMatches;

}
const getSummonerMatchIdsDb = (summonerName) => {

    partidas = [];

    let listadoMatches = getMatchesDb(summonerName);

    for (partida of listadoMatches.matches) {
        partidas.push(partida.gameId)
    }
    return partidas;

}



module.exports = {
    getMatchesDb,
    getSummonerMatchIdsDb,
    getUserIdDb,
}