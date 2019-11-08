const opts1 = {
    summonerName: {
        demand: true,
        alias: 'n'
    },
    region: {
        demand: true,
        alias: 's'
    }
}

const opts1a = {
    summonerName: {
        demand: true,
        alias: 'n'
    }
}

const opts1b = {
    region: {
        demand: true,
        alias: 's'
    },
    tier: {

        alias: 't',
    }
}

const argv = require('yargs')
    .command('partidas', 'Busca la información del jugador', opts1)
    .command('userId', 'Busca la información del jugador', opts1a)
    .command('userMatches', 'Busca la información del jugador', opts1a)
    .command('matchesData', 'Busca la información del jugador', opts1b)
    .help()
    .argv;

module.exports = {
    argv
}