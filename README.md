# Convert Garmin Xero Files

> [!CAUTION]
> Work in progress

Convert files from the Garmin Xero C1 Pro Chronograph to something you can import into the [GRT](https://www.grtools.de/).

You can use the tools on https://useyournose.github.io/xeroconv/.

## Compatibility

As Garmin is a big and funny company and my code is fragile, here are the tested versionsof the different fileformats the Xero and Shotview provides.

| filetype | version |
| :---: | :---: |
| `*.fit` | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fuseyournose%2Fxeroconv%2Fraw%2Fxls-support%2Fdocs%2Ftestedversions.json&query=%24.xero.version&label=firmware+version) |
| `*.csv` | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fuseyournose%2Fxeroconv%2Fraw%2Fxls-support%2Fdocs%2Ftestedversions.json&query=%24.shotview_a.version&label=Shotview+on+Android) |
| `*.csv` | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fuseyournose%2Fxeroconv%2Fraw%2Fxls-support%2Fdocs%2Ftestedversions.json&query=%24.shotview_i.version&label=Shotview+on+iOS) |
| `*.xls` | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fuseyournose%2Fxeroconv%2Fraw%2Fxls-support%2Fdocs%2Ftestedversions.json&query=%24.shotview_a.version&label=Shotview+on+Android) |
| `*.xlsx` | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fuseyournose%2Fxeroconv%2Fraw%2Fxls-support%2Fdocs%2Ftestedversions.json&query=%24.shotview_i.version&label=Shotview+on+iOS) |


## techstack

https://github.com/  
https://pages.github.com/  
https://jsdelivr.net


## third party tools

[3rd Party Attributions](third-party-attributions.txt)

| tool | latest release | version in use |
| --- | --- | --- |
| https://www.papaparse.com/ | ![GitHub Release](https://img.shields.io/github/v/release/mholt/papaparse?sort=date) | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fuseyournose%2Fxeroconv%2Fraw%2Fxls-support%2Fdocs%2Ftestedversions.json&query=%24.papaparse.version&label=version) |
| https://docs.sheetjs.com/docs/  | https://cdn.sheetjs.com/ | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fuseyournose%2Fxeroconv%2Fraw%2Fxls-support%2Fdocs%2Ftestedversions.json&query=%24.sheetjs.version&label=version) |
| https://github.com/garmin/fit-javascript-sdk?tab=License-1-ov-file  | ![GitHub Release](https://img.shields.io/github/v/release/garmin/fit-javascript-sdk?sort=date) | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fuseyournose%2Fxeroconv%2Fraw%2Fxls-support%2Fdocs%2Ftestedversions.json&query=%24.fitsdk.version&label=version) |
| https://bulma.io/documentation  | ![GitHub Release](https://img.shields.io/github/v/release/jgthms/bulma?sort=date) | ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fuseyournose%2Fxeroconv%2Fraw%2Fxls-support%2Fdocs%2Ftestedversions.json&query=%24.bulma.version&label=version) |
| https://fontawesome.com/ |  |  |

## building and updating

### bulma

https://bulma.io/documentation/start/installation/ 

### papaparse

[Install](https://github.com/mholt/PapaParse?tab=readme-ov-file#install) references [unpkg](https://unpkg.com/papaparse@latest/papaparse.min.js)

### sheets.js

[cdn.sheetsjs.com](https://cdn.sheetjs.com/)

### fitsdk

download in the release section [garmin/fitsdk](https://github.com/garmin/fit-javascript-sdk)

