const http = require('http');
const url = require('url');
const async = require('async');
const mongoose = require('mongoose');
const { getAll, getAllLeague, getLeagueIds, getUserData, getMatches, print, printTeams, getAllTeams } = require('../getters/matchHistory');
const { iterator1 } = require('../getters/processAndSave');
const { getUserIdDb, getSummonerMatchIdsDb } = require('../getters/jsonsdb');
//const { iterator1 } = require('../getters/matchHistory');
const needle = require('needle')
const argv = require('../arguments/playerArgvs').argv;
const fs = require('fs')

let comando = argv._[0];


switch (comando) {

    case 'partidas':

        getAll(argv.region, argv.summonerName)

        // .then(resultado => {

        //     mongoose.connection.close(function() {
        //         console.log('all files saved')
        //         process.exit();
        //     });

        // });
        break;


    case 'userId':
        let id = getUserIdDb(argv.summonerName);
        console.log(id)
        break;

    case 'userMatches':
        // let url = "https://acs.leagueoflegends.com/v1/stats/game/ESPORTSTMNT03/1020768?gameHash=6ddbb6e99fba1528"
        // let gameHash = (url.parse(url).query).split('=')[1];
        // let server = (url.parse(url).pathname).split('/')[4];
        // let gameId = (url.parse(url).pathname).split('/')[5];

        //console.log(urls)
        getAllTeams(argv.summonerName);
        //console.log(urls)
        // let URLs = printTeams(urls, argv.summonerName);
        // async.eachSeries(URLs, iterator1, function(err) {
        //     // global callback for async.mapSeries
        //     if (err) {
        //         console.log(err)
        //     } else {
        //         console.log('All Needle requests successful');
        //         resolve('guardado')
        //     }
        // });
        // let matchesIds = getSummonerMatchIdsDb(argv.summonerName);
        // console.log(gameHash);
        // console.log(server);
        // console.log(gameId);

        break;

    case 'matchesData':
        getAllLeague(argv.region, argv.tier);
        break;

    default:
        console.log('Comando no reconocido');



}