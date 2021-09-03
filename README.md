# Basketball Reference Player Data Scraper

There isn't any npm package for scraping player data from basketball-reference.com so I made one myself.

Take a look at the documentation below for more information

# Documentation

## getAllPlayers(season, duplicates)

Usage:

```
const bbstats = require('bbref-player-stats');

// Request per game player data without duplicates
const result1 = await bbstats.getAllPlayers(2021);

// Request per game player data with duplicates (separate data for each team the player was on)
const result2 = await bbstats.getAllPlayers(2021, true);
```

Returns a JSON object with the scraped player data from https://www.basketball-reference.com/leagues/NBA_${season}_per_game.html
