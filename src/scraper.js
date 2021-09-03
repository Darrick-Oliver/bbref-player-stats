const fetch = require('node-fetch');
const cheerio = require('cheerio');

const STAT_INDEX = ['name', 'position', 'age', 'team', 'games_played', 'games_started', 'minutes_played', 'fg_made', 'fg_attempted', 'fg_percent', 'threes_made', 'threes_attempted', 'threes_percent', 'twos_made', 'twos_attempted', 'twos_percent', 'eff_fg_percent', 'ft_made', 'ft_attempted', 'ft_percent', 'off_rebounds', 'def_rebounds', 'tot_rebounds', 'assists', 'steals', 'blocks', 'turnovers', 'personal_fouls', 'points'];

exports.getAllPlayers = async (season, duplicates = false) => {
    // Get HTML from BBREF and turn into text data
    const body = await fetch(`https://www.basketball-reference.com/leagues/NBA_${season}_per_game.html`)
                        .then(async (result) => {
                            return await result.text();
                        });

    const $ = cheerio.load(body);
    const statList = [];

    // Form list with table data
    $('td').each((i, stat) => {
        statList.push($(stat).text());
    });

    // Create 2D array
    const BBREF_COLS = 29;
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