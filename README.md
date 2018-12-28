# ep-stats

> Highly experimental statistics extractor for the game Empires &amp; Puzzles (available on [Android](https://play.google.com/store/apps/details?id=com.smallgiantgames.empires) & [iOS](https://itunes.apple.com/app/id1117841866)).

## Disclaimer

I am not linked to small giant games (game developer) in any way.

This project is experimental and developed for the fun on my free time.

It is written at thought-speed and not tested.

I'd be thrilled to see others use it but please don't judge me by it's quality XD.

## What it does

As a serious E&P player, I wanted to get insights into how my alliance - and its members - fares in wars and against titans.

The only summary the games gives you is a message in the alliance chat.

This project takes a screenshot of the results, [OCR](https://en.wikipedia.org/wiki/Optical_character_recognition)'s it to retrieve the information as text and pushes it on a GSheet.

One can then create graphs to show the members' performance against time.

## How it does it

The project contains an HTTP server that serves a page where one can upload the screenshot of the war/titan results.

It uses [tesseract](https://github.com/tesseract-ocr/tesseract/wiki) to get the information from the image and the GSheet API to push the stats on a GSheet.

## How to run it

> Note: you'll need to install tesseract and NodeJS first.

```shell
git clone git@github.com:quilicicf/ep-stats.git
cd ep-stats
npm install

# Get the value of SHEET_ID from the URL of your sheet that looks like this:
# https://docs.google.com/spreadsheets/d/$SHEET_ID/edit#gid=0
npm start "$SHEET_ID"
```

You can then open `http://[host address]:12012` where `host address` is the address displayed in the stdout of the command `npm start`.

## Roadmap

### DONE

|Item|Day of implementation|
|---|---|
|Add full alliance stats (only member performance was added)|2018_12_28|

### TODO

- [ ] Add war bonus in stats
- [ ] Add titans page
- [ ] Auto sheet creation for new year
- [ ] Retrieve member's list from the GSheet (currently copied both in the sheet and the server)
