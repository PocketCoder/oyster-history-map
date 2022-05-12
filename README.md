<img src="public/assets/logo.png" width="128">

# Tubular - _your history on TfL, visualised_

> The project is currently live at [🚇🚇🚇.ml](https://🚇🚇🚇.ml).

![GitHub](https://img.shields.io/github/license/PocketCoder/tubular) ![GitHub package.json version](https://img.shields.io/github/package-json/v/PocketCoder/tubular) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/PocketCoder/tubular) ![GitHub last commit](https://img.shields.io/github/last-commit/PocketCoder/tubular) ![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/PocketCoder/tubular) ![Website](https://img.shields.io/website?url=https%3A%2F%2Ftubular.110399.xyz)

---

> **Contents:** [Minimum Viable Product](#mvp) &bull; [Information sources](#sources) &bull; [Logic Explainer](#linesjson-and-scriptjs-logic-explained) &bull; [Next Steps](#next-steps) &bull; [Extended To Do List](#things-i-may-or-may-not-eventually-add)

I made this project because I wanted to see how much of the TfL network I've been on...and because ticking off stations on a physical map was too easy.

_I am open to new ideas for names._

## M.V.P.

- The map displays and is faded out initially.
- Any previously added stations are retrieved from `localStorage` and added to the map.
- The input box makes the station fade in, stores it in `localStorage`, and updates the line to be complete.
- You can upload a CSV file (downloaded from the Oyster website) to mass-add stations.
- You can see a progress bar for how many stations you've visited.
- Bus data is also saved in case of future use.

## Sources

I stole the Oyster SVG Map from: [https://tfl.gov.uk/Modules/TubeMap?nightMode=false](https://tfl.gov.uk/Modules/TubeMap?nightMode=false)

_(I spent **hours** changing the IDs on the [map.svg](public/assets/map.svg) so that I could manipulate them. Perhaps longer than I should have. I'm fragile, please don't say if there was an easier way as I may collapse.)_

[stations.json](public/assets/stations.json) and [lines.json](public/assets/lines.json) were adapted from [@paulcuth's](https://gist.github.com/paulcuth/1111303) and [@Lissy93's](https://gist.github.com/Lissy93/cb316efbf4b0968bc744cbbe48a574ab) gists, as well as a [TfL Source](https://content.tfl.gov.uk/station-abbreviations.pdf).

_(Some of the three-letter station codes were non-existent so I made them up. I didn't keep track of which are made up. I'm sorry.)_

## [lines.json](public/assets/lines.json) and [script.js](public/assets/lines.json) logic explained

TODO:

## Next steps

- [x] UI Polish
  - [x] Mobile-friendly UI
  - [x] Make it prettier
  - [x] Fix font
- [x] Bus route data (X routes used out of X) (for now) (WIP)
- [ ] Login and User Profiles
  - [ ] Data saved in database, not LS; therefore syncing across devices
- [ ] Stats
  - [ ] % of stations visited
    - [x] on a line
    - [ ] on the whole TfL service
  - [ ] % label next to progress bar
  - [ ] Line label next to progress bar
- [ ] Export data as CSV or PNG Map.
- [x] Move development to TypeScript.

## Things I may or may not eventually add

- [ ] PWA
- [ ] Hover on line/stations for emphasis and information (number of visits, last visit)
- [ ] Challenges/Achievements:
  - [ ] Streak: visit a new station every month
    - 272 stations; 272/12 = 22 years to do them all
  - [ ] Travel through the whole of each line
    - Stations at either end have to be visited
    - 11 lines + overground + trams
  - [ ] Visit every station on a line
  - [ ] Use every line
  - [ ] Use every branch of the Northern line?
    - Or another fun idiosyncrasy of TfL
  - [ ] Use every overground line
  - [ ] Have gotten the first/last train of the day of that line/on TfL
- [ ] Map of Riverboat services
- Leaderboards?
  - Would require authentication of CSVs
    - Complicated:- See if their journeys were feasible. Times taken + whether the line/stations were open on that day/time + gap between entries
    - Easier:- User history. Not too many visited too often. Account age and number of stations visited.
    - Easiest:- Honour system
  - Can be turned on/off by users
  - Rankings of users stats
