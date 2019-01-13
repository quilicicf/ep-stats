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

### Create the spreadsheet

Create a google spreadsheet from your google account.

:warning: You'll need to keep this spreadsheet up-to-date when a new player joins in! Otherwise his stats won't be added.

#### Add members

Create a sheet named `Members` that looks like this:

|Pseudo|Regex|
|---|---|
|PseudoOfPlayer1||
|PseudoOfPlayer2||
|PseudoOfPlayer3||
|PseudoOfPlayer4||

The regex field should only be used if tesseract has troubles parsing the name of a player.

Example: If `ImMaryPoppinsYall` gets parsed as `|mMaryPoppinsYa|l`, you can put the regex `[|Il]mMaryPoppinsYa[|Il]{2}` to fix the parsed results.

#### Wars

Create a sheet name `Wars_<YEAR>` that looks like the example below. Only crate the header row, the rest will be created by the program (the second line is here to show an example of the data).

|War date \ Member|Total|Enemy score|Bonus|PseudoOfPlayer1|PseudoOfPlayer2|...|
|---|---|---|---|---|---|---|
|24_12|2456|3201|ARROWS|123|437|...|

#### Titans

Create a sheet name `Titans_<YEAR>` that looks like the example below. Only crate the header row, the rest will be created by the program (the second line is here to show an example of the data).

|Titan date \ Member|Total|Life|Stars|Color|PseudoOfPlayer1|PseudoOfPlayer2|...|
|---|---|---|---|---|---|---|---|
|24_12|1327000|1327000|6|HOLY|77000|144524|...|

### Configure and run the server

```shell
git clone git@github.com:quilicicf/ep-stats.git
cd ep-stats
npm install

# At first launch only, allow ep-stats to push on you spreadsheet
# When your internet browser opens, log in to the account with which you craeted the sheet of course
npm run bootstrap

# Get the value of SHEET_ID from the URL of your sheet that looks like this:
# https://docs.google.com/spreadsheets/d/$SHEET_ID/edit#gid=0
npm run start:back "$SHEET_ID"
npm run start:front
```

You can then open `http://[host address]:12011` where `host address` is the address displayed in the stdout of the command `npm run start:front`.

## Roadmap

### DONE

|Item|Day of implementation|
|---|---|
|Add full alliance stats (only member performance was added)|2018_12_28|
|Add war bonus in stats|2018_12_29|
|Add war date selector|2019_01_07|
|Add war enemy score in stats|2019_01_07|
|Add titans page|2019_01_13|
|Retrieve member's list from the GSheet|2019_01_13|

### TODO

- [ ] Auto sheet creation for new year
