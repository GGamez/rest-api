require('../config/config');

const jsons = require('./jsonsdb');

const fs = require('fs');

const mongoose = require('mongoose');

const req = require('request');

const async = require('async');

const { iterator1, noIteratior } = require('./processAndSave');

const Usuario = require('../models/usuario');

const urlo = require('url');

const needle = require('needle');
const sleep = require('sleep');


const getUserData = function(region, summonerName, callback) {

    const userData = {
        method: 'GET',
        url: "https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key=" + process.env.FIRST_STEP
    };

    req(userData, function(e, res, body) {

        data = JSON.parse(body);

        // writeUser(summonerName, body);
        console.log(data.accountId);
        callback(data.accountId);

    });


    return callback;
}




const getMatches = function(region, summonerName, userId) {

    return new Promise((resolve, reject) => {

        const matchList = {
            method: 'GET',
            url: "https://" + region + ".api.riotgames.com/lol/match/v4/matchlists/by-account/" + userId + "?api_key=" + process.env.FIRST_STEP
        };

        req(matchList, function(e, res, body) {

            let mat = JSON.parse(body);
            console.log(mat);
            let idList = getSummonerMatchIds(mat);

            // writeMatches(summonerName, mat, body);
            console.log(idList);
            resolve(idList);

            if (e) { reject(e => console.log(e)) };


        });

    });
}


function print(region, summonerName, idList) {

    urls = []

    let max = 100;
    let limit = process.env.limit;
    for (i = 0; i < max; i++) {
        //console.log(idList[i])
        var url = {
            url: "https://" + region + ".api.riotgames.com/lol/match/v4/matches/" + idList[i] + "?api_key=" + process.env.FIRST_STEP,
            name: summonerName,
            nmro: i
        }
        urls.push(url);

        if (i == limit) {
            break;
        }

    }
    return urls;
}

const getAll = function(region, summonerName) {

    return new Promise((resolve, reject) => {

        getUserData(region, summonerName, (function(userId) {
            console.log(userId);
            getMatches(region, summonerName, userId)
                .then((idList) => {
                    console.log(userId)
                    body = { summonerId: userId };

                    let URLs = print(region, summonerName, idList);
                    console.log(URLs);

                    async.eachSeries(URLs, iterator1, function(err) {
                        // global callback for async.mapSeries
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('All Needle requests successful');
                            resolve('guardado')
                        }
                    });

                }).catch(err => {

                    console.log(err);
                });

        }));
    });

}



const getTeamLinks = function(summonerName) {

    return new Promise((resolve, reject) => {
        var options = {};
        needle.get('https://lol.gamepedia.com/index.php?title=Special:CargoExport&tables=MatchScheduleGame%3DMSG%2C+MatchSchedule%3DMS&join+on=MSG.UniqueMatch%3DMS.UniqueMatch&fields=MSG.MatchHistory%3DMH&where=MS.Team1%3D%22Cream+Esports+Mexico%22+AND+MSG.MatchHistory+IS+NOT+NULL+OR+MS.Team2%3D%22Cream+Esports+Mexico%22+AND+MSG.MatchHistory+IS+NOT+NULL&order+by=MS.DateTime_UTC+DESC&limit=2000&format=json', options, function(error, response, body) {
                urls = {...body }
                    //let URLs = printTeams(urls, argv.summonerName);
                console.log(response)
                    //callback(urls);
                    // async.eachSeries(URLs, iterator1, function(err) {
                    //     // global callback for async.mapSeries
                    //     if (err) {
                    //         console.log(err)
                    //     } else {
                    //         console.log('All Needle requests successful');
                    //         resolve('guardado')
                    //     }
                    // });
                let URLs = printTeams(urls, summonerName);
                resolve(URLs)
            })
            //console.log(urls);
    })
}



function printTeams(urlList, teamName) {

    urls = []
    let counter = 0;
    let max = 100;
    let limit = process.env.limit;
    for (matches in urlList) {

        counter += 1;


        let asd = urlList[matches].MH
            //console.log(asd)
        let gameHash = (urlo.parse(asd).hash).split('?')[1].split('&')[0].split('=')[1];
        let server = (urlo.parse(asd).hash).split('/')[1];
        let matchId = (urlo.parse(asd).hash).split('/')[2].split('?')[0];
        console.log(gameHash)
        console.log(server)
        console.log(matchId)
            //console.log(idList[i])
        let url = {
            url: "https://acs.leagueoflegends.com/v1/stats/game/" + server + "/" + matchId + "/timeline?gameHash=" + gameHash,
            name: teamName,
            nmro: matches
        }
        urls.push(url);




    }
    console.log(urls)
    return urls;
}




const getAllTeams = function(summonerName) {

    return new Promise((resolve, reject) => {

        // getUserData(region, summonerName, (function(userId) {
        //     console.log(userId);
        //     getMatches(region, summonerName, userId)
        //         .then((idList) => {
        //             console.log(userId)
        //             body = { summonerId: userId };
        //             Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: false, context: 'query' }, (err, usuarioDB) => {

        //                 if (err) {
        //                     return res.status(400).json({
        //                         ok: false,
        //                         err
        //                     });
        //                 }
        //             })

        var options = {};
        //let urls = {};

        getTeamLinks(summonerName).then(urls => {
            //console.log(callback)
            console.log(urls)
                //noIteratior();
            async.eachSeries(urls, iterator1, function(err) {
                // global callback for async.mapSeries
                if (err) {
                    console.log(err)
                } else {
                    console.log('All Needle requests successful');
                    resolve('guardado')
                }
            });
        })


        // let URLs = printTeams(urlList, summonerName);
        // console.log(URLs);

        // async.eachSeries(URLs, iterator1, function(err) {
        //     // global callback for async.mapSeries
        //     if (err) {
        //         console.log(err)
        //     } else {
        //         console.log('All Needle requests successful');
        //         resolve('guardado')
        //     }
        // });

        // }).catch(err => {
        //     alert(error);
        //     console.log(err);
        // });

        //  }));
    });

}




const getUserIdData = function(region, tiero, id) {

    return new Promise((resolve, reject) => {
        urls = []
        id.map(ids => {
            userData = {
                tier: tiero,
                region: region,
                method: 'GET',
                url: "https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/" + ids + "?api_key=" + process.env.FIRST_STEP
            };
            urls.push(userData)
        })
        resolve(urls)
    })
}

async function iteratorLeague(URL, done) {

    await new Promise((resolve, reject) => {
        var finalJs = [];
        var options = {};
        let player = 0;
        console.log(URL)
        console.log(URL.url)
        needle.get(URL.url, options, function(error, response, body) {
            if (error) { return done(error) };
            // counter += 1;

            sleep.msleep(2020);
            finalJs.push(body.accountId)

            getMatches(URL.region, URL.tier, body.accountId)
                .then((idList) => {
                    //console.log(body.accountId)

                    let URLs = print(URL.region, URL.tier, idList);
                    // console.log(URLs);

                    async.eachSeries(URLs, iterator1, function(err) {
                        // global callback for async.mapSeries
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('All Needle requests successful');
                            resolve('ok')
                                //resolve('guardado')
                                //done('guardado')
                        }
                    });

                }).catch(err => {
                    console.log(err);
                });
            //console.log(body.gameId)
            console.log(finalJs)
                //  processAndSaveInDB(URL, body)
                //done(null);
        });

    });


};

const getLeagueIds = function() {

    return new Promise((resolve, reject) => {
        let tier = 'DIAMOND';
        let division = 'I';
        let queue = 'RANKED_SOLO_5x5';
        let region = 'euw1';
        var options = {};
        needle.get("https://" + region + ".api.riotgames.com/lol/league/v4/entries/" + queue + "/" + tier + "/" + division + "?page=1&api_key=" + process.env.FIRST_STEP, options, function(error, response, body) {
            let players = {...body }
                //let URLs = printTeams(urls, argv.summonerName);
                //console.log(urls)
                //callback(urls);

            let bodyPlayers = printLeagueIds(players);
            //console.log(bodyPlayers);
            resolve(bodyPlayers)
        })

    })
}


function printLeagueIds(body) {

    ids = []
    let max = 100;
    let limit = process.env.limit;
    //console.log(body)
    Object.keys(body).map(players => {
            // console.log(players);
            ids.push(body[players].summonerId)
        })
        //console.log(ids)
    return ids;
}


const getAllLeague = (region, tier) => {

    //let counter = 0;
    getLeagueIds()
        .then(idList => {
            getUserIdData(region, tier, idList)
                .then(URLs => {
                    // console.log(URLs)
                    async.eachSeries(URLs, iteratorLeague, function(err) {
                        console.log('eeeeeey')
                            // counter += 1;
                            // console.log(counter)
                            // global callback for async.mapSeries
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('All Needle requests successful');
                            //resolve('guardado')
                        }
                    });

                })

        }).catch(err => {
            alert(error);
            console.log(err);
        });
    //console.log(idList);

}






const getSummonerMatchIds = (listMatches) => {

    partidas = [];
    //console.log(listMatches)
    try {
        for (partida of listMatches.matches) {
            partidas.push(partida.gameId)
        }
        return partidas;
    } catch (e) {
        console.log(e)
    }

}



function writeUser(summonerName, data) {

    fs.writeFile(`jsons/players/${summonerName}_Data.json`, data, (err) => {
        if (err) throw new Error('No se pudo grabar', err);
    });

}

function writeMatches(summonerName, listMatches, data) {

    fs.exists(`jsons/matches/${summonerName}_Matches.json`, function(exists) {

        if (!exists) {

            fs.writeFile(`jsons/matches/${summonerName}_Matches.json`, data, (err) => {
                if (err) throw new Error('No se pudo grabar', err);
            });

        } else {

            var historial = jsons.getMatchesDb(summonerName);
            // console.log(historial);
            // console.log(listMatches);

            for (partida of listMatches.matches) {
                addMatch(partida, partida.gameId, historial, summonerName);
            }
        }
    });
}


function matchExists(gameId, historial) {
    return historial.matches.some(function(el) {
        return el.gameId === gameId;
    });
}

function addMatch(partida, gameId, historial, summonerName) {
    if (!matchExists(gameId, historial)) {
        historial.matches.push(partida);
        actualizedMatches = JSON.stringify(historial);
        fs.writeFile(`jsons/matches/${summonerName}_Matches.json`, actualizedMatches, function(err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }

}


module.exports = {
    getAll,
    getAllTeams,
    getAllLeague,
    getUserData,
    getMatches,
    print,
    printTeams,
    getLeagueIds
}