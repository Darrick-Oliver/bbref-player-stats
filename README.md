# Basketball Reference Player Data Scraper

There isn't any npm package for scraping player data from basketball-reference.com so I made one myself.

Take a look at the documentation below for more information

# Documentation

## getAllPlayers(season, stat = 'per_game', duplicates = 'false')

**Usage:**

```js
const bbstats = require("bbref-player-stats");

// Request per game player data without duplicates
const result1 = await bbstats.getAllPlayers(2021);

// Request specific stat from player data without duplicates
const result2 = await bbstats.getAllPlayers(2021, "totals");

// Request per game player data with duplicates (separate data for each team the player was on)
const result3 = await bbstats.getAllPlayers(2021, "per_game", true);
```

**Supported stats:**

'per_game', 'totals'

**Return value:**

Returns an array of all NBA players as JSON objects from the specified season

## getPlayerStats(id, stat = 'per_game', type = 'regular')

**Usage:**

```js
const bbstats = require("bbref-player-stats");

const players = await bbstats.getAllPlayers(2021);

// Request regular season per game stats using player id
const result1 = await bbstats.getPlayerStats(players[0].id);
const result2 = await bbstats.getPlayerStats("curryst01");

// Request specific stat during regular season using player id
const result3 = await bbstats.getPlayerStats("curryst01", "totals");

// Request specific stat during regular season or playoffs using player id
const result4 = await bbstats.getPlayerStats(
  "curryst01",
  "per_game",
  "playoffs"
);
```

**Supported stats:**

'per_game', 'totals', 'advanced'

**Return value:**

Returns an array of JSON objects, each of which is a season's worth of the given statistical data on the player
