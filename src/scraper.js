const fetch = require('node-fetch');
const cheerio = require('cheerio');

const STAT_INDEX = ['id', 'name', 'position', 'age', 'team', 'games_played', 'games_started', 'minutes_played', 'fg_made', 'fg_attempted', 'fg_percent', 'threes_made', 'threes_attempted', 'threes_percent', 'twos_made', 'twos_attempted', 'twos_percent', 'eff_fg_percent', 'ft_made', 'ft_attempted', 'ft_percent', 'off_rebounds', 'def_rebounds', 'tot_rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'personal_fouls', 'points'];
const PLAYER_STAT_INDEX = ['season', 'age', 'team', 'league', 'position', 'games_played', 'games_started', 'minutes_played', 'fg_made', 'fg_attempted', 'fg_percent', 'threes_made', 'threes_attempted', 'threes_percent', 'twos_made', 'twos_attempted', 'twos_percent', 'eff_fg_percent', 'ft_made', 'ft_attempted', 'ft_percent', 'off_rebounds', 'def_rebounds', 'tot_rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'personal_fouls', 'points'];
const ADVANCED_INDEX = ['season', 'age', 'team', 'league', 'position', 'games_played', 'minutes_played', 'per', 'ts_percent', 'threes_attempt_rate', 'ft_attempt_rate', 'orb_percent', 'drb_percent', 'trb_percent', 'ast_percent', 'stl_percent', 'blk_percent', 'tov_percent', 'usg_percent', 'off_ws', 'off_ws', 'def_ws', 'ws', 'ws_per48', 'obpm', 'obpm', 'dbpm', 'bpm', 'vorp'];

exports.getAllPlayers = async (season, stat = 'per_game', duplicates = false) => {
    // Temporary, will add more stat indexes later
    if (stat !== 'per_game' || stat !== 'totals')
        return [];

    // Get HTML from BBREF and turn into text data
    const $ = await fetch(`https://www.basketball-reference.com/leagues/NBA_${season}_${stat}.html`)
        .then(async (result) => {
            const body = await result.text();
            return cheerio.load(body);
        });
    const statList = [];

    // Form list with table data
    $('td').each((i, stat) => {
        const link = $(stat).find('a').attr('href');
        if (link) {
            let result = link.match(/\/players\/[a-z]\/.+\./);
            if (result) {
                result = result[0].substring(11);
                result = result.substring(0, result.length - 1);
                statList.push(result);
            }
        }
        statList.push($(stat).text());
    });

    // Create 2D array
    const BBREF_COLS = 30;
    const BBREF_ROWS = statList.length / BBREF_COLS;

    // Make json object
    const playerList = [];
    for (let i = 0; i < BBREF_ROWS; i += 1) {
        const player = {};
        for (let j = 0; j < BBREF_COLS; j += 1) {
            player[STAT_INDEX[j]] = statList[i*BBREF_COLS + j];
        }
        playerList.push(player);
    }

    // Remove duplicates if requested
    if (!duplicates) {
        const alreadySeen = [];
        for (let i = 0; i < playerList.length; i += 1) {
            if (alreadySeen[playerList[i].name]) {
                playerList.splice(i, 1);
                i -= 1;
            }
            else {
                alreadySeen[playerList[i].name] = true;
            }
        }
    }

    return playerList;
}

exports.getPlayerStats = async (id, stat = 'per_game', type = 'regular') => {
    if (id.length === 0)
        return null;
    
    // Check type
    const part = (type === 'regular') ? '' : (type === 'playoffs') ? type.concat('_') : -1;
    if (part === -1) return [];
    
    // Get HTML from BBREF and turn into text data
    const $ = await fetch(`https://www.basketball-reference.com/players/${id.charAt(0)}/${id}.html`)
        .then(async (result) => {
            const body = await result.text();
            return cheerio.load(body);
        });
    const statList = [];

    // Get indeces
    let indeces = PLAYER_STAT_INDEX;
    if (stat === 'totals') {
        indeces.push('triple_doubles', 'triple_doubles');
    }
    else if (stat === 'advanced') {
        indeces = ADVANCED_INDEX;
    }

    // Form list with table data
    $(`table[id=${part}${stat}]`).find('tbody > tr').each((i, rows) => {
        console.log(i);
        let season = {};
        $(rows).find('td, th').each((i, data) => {
            season[indeces[i]] = $(data).text();
        })
        statList.push(season);
    });

    return statList;
}