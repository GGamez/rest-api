///////////////////////
// matchHistory
///////////////////////

//const { getChampName, getPlayerLane, getRole } = require('./switch');
//const Schema = mongoose.Schema;
// const rp = require('request-promise');
// const async = require('async');
// let region = "euw1";
// let summonerName = "Reformed Juarez";

// const sleep = require('sleep');

// const needle = require('needle');

// let APIKey = process.env.FIRST_STEP;

// const getprint = function(region, id, summonerName) {

//     return new Promise((resolve, reject) => {

//         var url = {
//             //{
//             method: 'GET',
//             url: "https://" + region + ".api.riotgames.com/lol/match/v4/matches/" + id + "?api_key=" + process.env.FIRST_STEP

//         };

//         req(url, (e, res, body) => {
//             console.log(body);
//             matc = JSON.parse(body);
//             saveMatch(matc, summonerName);
//             resolve(body);
//         });

//         sleep.msleep(600);
//     })
// }

// function getUserData(region, summonerName) {

//     const userData = {
//         method: 'GET',
//         url: "https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key=" + process.env.FIRST_STEP
//     };

//     rp(userData)
//         .then((data) => {

//             writeUser(summonerName, data);

//             let id = JSON.parse(data);
//             let userId = id.accountId;
//             console.log(userId);

//             getSummonerMatches(region, summonerName, userId);

//         })
//         .catch((err) => {
//             console.log(err);
//         });

// }


// function getSummonerMatches(region, summonerName, userId, callback) {

//     //let userId = await getUserId(summonerName);

//     const matchList = {
//         method: 'GET',
//         url: "https://" + region + ".api.riotgames.com/lol/match/v4/matchlists/by-account/" + userId + "?api_key=" + process.env.FIRST_STEP
//     };

//     rp(matchList)
//         .then((data) => {

//             let matches = []

//             let listMatches = JSON.parse(data);
//             writeMatches(summonerName, listMatches, data);

//             let idList = getSummonerMatchIds(listMatches);
//             //console.log(idList);


//             let counter = 0;
//             let limit = 22;


//             for (id of idList) {

//                 counter += 1

//                 var url = {
//                     //{
//                     method: 'GET',
//                     url: "https://" + region + ".api.riotgames.com/lol/match/v4/matches/" + id + "?api_key=" + process.env.FIRST_STEP

//                 };

//                 //let match = 
//                 getMatches(url, (err, mat) => {

//                     if (err) {
//                         console.log(err);
//                     } else {
//                         //match = JSON.parse(mat)
//                         //console.log(matches);
//                         matches.push(mat);
//                     }


//                     //return mat;
//                 });

//                 sleep.msleep(600);

//                 if (counter == 20) {
//                     sleep.msleep(10000);
//                 }


//                 if (counter == 25) {
//                     saveMatch(matches, summonerName);
//                     break;
//                 }

//             }

//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }

// function getMatches(url, callback) {

//     //var matches = [];
//     console.log(url)

//     req(url, (e, res, body) => {

//         return new Promise((resolve, reject) => {
//             if (reject) {
//                 reject(console.log(e))
//             } else {
//                 resolve(callback(null, body))
//             }

//         })

//         //console.log(body)

//     });

// // rp(url)
// //     .then((data) => {
// //         let match = JSON.parse(data);
// //         //matches.push(match);
// //         // console.log(data)
// //         //saveMatch(match, summonerName);
// //         // if (counter == limit) {
// //         //     saveMatch(matches, summonerName);
// //         // }
// //         callback(null, match);

// //     })
// //     .catch((e) => {
// //         console.log(e);
// //     });
//}

///////////////////////
// Commands
///////////////////////

// const express = require('express');
// const mongoose = require('mongoose');

// // const app = express();
// // const sleep = require('sleep');
// // var Schema = mongoose.Schema;


//getId(argv.region, argv.summonerName)

// var idss = getUserData(argv.region, argv.summonerName, function(userId) {
//     console.log(userId);
// });


// .then(body => {
//     console.log(body);
// });
// }).then(function() {
//     mongoose.connection.close(function() {
//         console.log('all files saved')
//         process.exit();
//     });

//let matchesid = getSummonerMatchIds(argv.region, argv.summonerName, id);
// let lista = getSummonerMatchIds(argv.region);


///////////////////////
//  proandsave
///////////////////////


//     fin.push({ creepsPerMinDeltas_20: body.participants[player].timeline.creepsPerMinDeltas['10-20'] })
//     fin.push({ creepsPerMinDeltas_30: body.participants[player].timeline.creepsPerMinDeltas['20-30'] })
//     fin.push({ xpPerMinDeltas_10: body.participants[player].timeline.xpPerMinDeltas['0-10'] })
//     fin.push({ xpPerMinDeltas_20: body.participants[player].timeline.xpPerMinDeltas['10-20'] })
//     fin.push({ xpPerMinDeltas_30: body.participants[player].timeline.xpPerMinDeltas['20-30'] })
//     fin.push({ goldPerMinDeltas_10: body.participants[player].timeline.goldPerMinDeltas['0-10'] })
//     fin.push({ goldPerMinDeltas_20: body.participants[player].timeline.goldPerMinDeltas['10-20'] })
//     fin.push({ goldPerMinDeltas_30: body.participants[player].timeline.goldPerMinDeltas['20-30'] })
//     fin.push({ csDiffPerMinDeltas_10: body.participants[player].timeline.csDiffPerMinDeltas['0-10'] })
//     fin.push({ csDiffPerMinDeltas_20: body.participants[player].timeline.csDiffPerMinDeltas['10-20'] })
//     fin.push({ csDiffPerMinDeltas_30: body.participants[player].timeline.csDiffPerMinDeltas['20-30'] })
//     fin.push({ xpDiffPerMinDeltas_10: body.participants[player].timeline.xpDiffPerMinDeltas['0-10'] })
//     fin.push({ xpDiffPerMinDeltas_20: body.participants[player].timeline.xpDiffPerMinDeltas['10-20'] })
//     fin.push({ xpDiffPerMinDeltas_30: body.participants[player].timeline.xpDiffPerMinDeltas['20-30'] })
//     fin.push({ damageTakenPerMinDeltas_10: body.participants[player].timeline.damageTakenPerMinDeltas['0-10'] })
//     fin.push({ damageTakenPerMinDeltas_20: body.participants[player].timeline.damageTakenPerMinDeltas['10-20'] })
//     fin.push({ damageTakenPerMinDeltas_30: body.participants[player].timeline.damageTakenPerMinDeltas['20-30'] })
//     fin.push({ damageTakenDiffPerMinDeltas_10: body.participants[player].timeline.damageTakenDiffPerMinDeltas['0-10'] })
//     fin.push({ damageTakenDiffPerMinDeltas_20: body.participants[player].timeline.damageTakenDiffPerMinDeltas['10-20'] })
//     fin.push({ damageTakenDiffPerMinDeltas_30: body.participants[player].timeline.damageTakenDiffPerMinDeltas['20-30'] })
//finalJs = Object.assign(...final);


///////////////////////
//  app/routes csv
///////////////////////


// let tocsv = []
// tocsv.push(jsonss.assignments)
// console.log(jsonss)
// const csvString = jsonss.assignments.join('\n')
// var usd = { asd }
//asd.push(jsonss.assignments)
// const result = exportFromJSON({
//         jsonss,
//         filename: 'data',
//         exportType: exportFromJSON.types.csv,
// })
//tojson = JSON.parse(asd);
// converter(asd, function(err, csv) {
//     if (err) return console.log(err);
//     console.log(csv);
// })


// const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
// const header = Object.keys(asd[0])
// let csvo = asd.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
// csvo.unshift(header.join(','))
// csvo = csvo.join('\r\n')

// res.json({
//     ok: true,
//     assignments,
//     count: conteo
// });
// jsonss = { assignments }
// let filename = 'download';
// let exportType = 'csv';

// let asd = jsonss.assignments;

// const fields = ["id"]
// const mp = { fields }
// var options = {
//     //noheader: false,
//     //headers: "rivalChamp,participantId,platformId,accountId,summonerName,summonerId,currentPlatformId,currentAccountId,matchHistoryUri,profileIcon,teamId,championId,spell1Id,spell2Id,win,item0,item1,item2,item3,item4,item5,item6,kills,deaths,assists,largestKillingSpree,largestMultiKill,killingSprees,longestTimeSpentLiving,doubleKills,tripleKills,quadraKills,pentaKills,unrealKills,totalDamageDealt,magicDamageDealt,physicalDamageDealt,trueDamageDealt,largestCriticalStrike,totalDamageDealtToChampions,magicDamageDealtToChampions,physicalDamageDealtToChampions,trueDamageDealtToChampions,totalHeal,totalUnitsHealed,damageSelfMitigated,damageDealtToObjectives,damageDealtToTurrets,visionScore,timeCCingOthers,totalDamageTaken,magicalDamageTaken,physicalDamageTaken,trueDamageTaken,goldEarned,goldSpent,turretKills,inhibitorKills,totalMinionsKilled,neutralMinionsKilled,neutralMinionsKilledTeamJungle,neutralMinionsKilledEnemyJungle,totalTimeCrowdControlDealt,champLevel,visionWardsBoughtInGame,sightWardsBoughtInGame,wardsPlaced,wardsKilled,firstBloodKill,firstBloodAssist,firstTowerKill,firstTowerAssist,firstInhibitorKill,firstInhibitorAssist,combatPlayerScore,objectivePlayerScore,totalPlayerScore,totalScoreRank,playerScore0,playerScore1,playerScore2,playerScore3,playerScore4,playerScore5,playerScore6,playerScore7,playerScore8,playerScore9,perk0,perk0Var1,perk0Var2,perk0Var3,perk1,perk1Var1,perk1Var2,perk1Var3,perk2,perk2Var1,perk2Var2,perk2Var3,perk3,perk3Var1,perk3Var2,perk3Var3,perk4,perk4Var1,perk4Var2,perk4Var3,perk5,perk5Var1,perk5Var2,perk5Var3,perkPrimaryStyle,perkSubStyle,statPerk0,statPerk1,statPerk2,10-20,0-10,role,lane,seasonId,gameVersion,queueId,gameCreation,rolerd,lanerd,champName,$init,highestAchievedSeasonTier,20-30,30",
//     delimiter: ",",
//     wrap: false,
//     headers: "key",
//     objectDenote: "",
//     arrayDenote: "",

// }