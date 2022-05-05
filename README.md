<img src="public/assets/logo.png" width="128">

# Tubular - _your history on TfL, visualised_

> **Contents:** [What works](#what-works-so-far) &bull; [Logic Explainer](#linesjson-and-scriptjs-logic-explained) &bull; [Information sources](#sources) &bull; [Next Steps](#next-steps) &bull; [Contribute](#how-to-contribute) &bull; [Extended To Do List](#things-i-may-or-may-not-eventually-add)

![GitHub](https://img.shields.io/github/license/PocketCoder/tubular) ![GitHub package.json version](https://img.shields.io/github/package-json/v/PocketCoder/tubular) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/PocketCoder/tubular) ![GitHub last commit](https://img.shields.io/github/last-commit/PocketCoder/tubular) ![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/PocketCoder/tubular) ![Website](https://img.shields.io/website?url=https%3A%2F%2Ftubular.110399.xyz)

---

I made this project becaue I wanted to see how much of the TfL network I've been on and because ticking off stations on a physcial map was too easy.

The project is currently live at [tubular.110399.xyz](https://tubular.110399.xyz).

_I am open to new ideas for names._

## What works so far

- The map displays and is faded out initially.
- The input box makes the station fade in, stores it in the localStorage, and updates the line to be complete.
- You can upload a CSV file (downloaded from the Osyter website) to mass-add stations.
- You can see a progress bar for how many stations you've visited.
- Bus data is also saved in case of future use.

## [lines.json](public/assets/lines.json) and [script.js](public/assets/lines.json) logic explained

TODO:

## Sources

I stole the Oyster SVG Map from: [https://tfl.gov.uk/Modules/TubeMap?nightMode=false](https://tfl.gov.uk/Modules/TubeMap?nightMode=false)

_(I spent **hours** changing the IDs on the [map.svg](public/assets/map.svg) so that I could manipulate them. Perhaps longer than I should have. I'm fragile, please don't say if there was an easier way as I may collapse.)_

[stations.json](public/assets/stations.json) and [lines.json](public/assets/lines.json) were adapted from [@paulcuth's](https://gist.github.com/paulcuth/1111303) and [@Lissy93's](https://gist.github.com/Lissy93/cb316efbf4b0968bc744cbbe48a574ab) gists, as well as a [TfL Source](https://content.tfl.gov.uk/station-abbreviations.pdf).

_(Some of the three-letter station codes were non-existent so I made them up. I didn't keep track of which are made up. I'm sorry.)_

## Next steps

- [ ] UI Polish
  - [ ] Mobile-friendly UI (WIP)
  - [ ] Make it prettier
  - [ ] Fix font
- [ ] Login and User Profiles
  - [ ] Data saved in database, not LS; therefore syncing across devices
- [ ] Stats
  - [ ] % of stations visited
    - [x] on a line
    - [ ] on the whole TfL service
  - [ ] % label next to progress bar
  - [ ] Line label next to progress bar
- [ ] Export data as CSV or PNG Map.
- [ ] Move development to TypeScript.

[More To Dos](#things-i-may-or-may-not-eventually-add)

## How to contribute

### Reporting Bugs

I made this on my own and I only do programming as a hobby, so there's bound to be bugs. The number of diffrent variations of visited stations is vast so there's no way I can test everything. I'm _pretty_ sure the logic JSONs are sound, but allow me some leeway.

Please make sure that your [issue](https://github.com/PocketCoder/tubular/issues) hasn't already been brought up. If it has, and your case differs to it, then simply reply with your unique steps to reproduce the issue.

When adding an issue, please include:

1. A **clear and descriptive title**,
2. a detailed desciption of the issue,
3. tour `localStorage` data,
4. any console error messages,
5. the steps take that lead up to the issue,
6. and what you expected to happen and why.

This way someone can recreate the environment and the bug locally.

### Submitting a feature request

Make sure that the feature isn't already on my [short-](#next-steps) or [long-](#things-i-may-or-may-not-eventually-add)term roadmap.

When making a feature request, include these details:

1. Describe the problem the feature will solve, or the functionality it will add.
2. Describe the solution you'd like
3. Describe alternatives you've considered
4. Additional context

---

## Things I may or may not eventually add

- [ ] Inital zoom-in is on user's home station.
- [ ] Hover on line/stations for emphasis and information (number of visits, last visit)
- [ ] Bus route data
  - [ ] Button/Icon in the corner
  - [ ] Reveals list of bus routes in London, shaded in if used
    - Bus number, From–To, No. times used
  - [ ] miles travelled in a year or overall
- [ ] Challenges/Achievments:
  - [ ] Streak: visit a new station every month
    - 272 stations; 272/12 = 22 years to do them all
  - [ ] Travel through the whole of each line
    - Stations at either end have to be visited
    - 11 lines + overground + trams
  - [ ] Visit every station on a line
  - [ ] Use every line
  - [ ] Use every branch of the Northern line?
    - Or another fun idiosyncracy of TfL
  - [ ] Use every overground line
  - [ ] Have gotten the first/last train of the day of that line/on TfL
- [ ] Map of Riverboat services
- Leaderboards?
  - Would require authentication of CSVs
    - Complicated:- See if their journeys were feasible. Times taken + whether the line/stations were open on that day/time + gap between entries
    - Easier:- User hsitory. Not too many visited too often. Account age and number of stations visited.
    - Easiest:- Honour system
  - Can be turned on/off by users
  - Rankings of users stats