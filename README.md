# grepo-tools

A cli tool for the game Grepolis by Innogames. This tool is not associated with or approved by Innogames and might be against the games terms of service. **The use of this tool is on your own risk!**

## Features

This project is planned to provide different useful tools for Grepolis. Here is a list of already implemented tools and planned ones:

- [x] **Wonders Alarm** - Check and alarm the ongoing progress of world wonders for a given world
- [ ] **Gold Market Alarm** - Check and alarm if the gold market has been emptied
- [ ] **API Scaper** - Scrape the public API of Grepolis world data and store it locally

## Getting Started

### Prerequisites

This tool has been created using [Bun](https://bun.sh/) and it's [native sqlite driver](https://bun.sh/docs/api/sqlite).

- Version of Bun (tested on 1.1.8)
- Grepolis account (it is recommended to not use this on your main account)
- maybe an VPN or Proxy

### Installation

1. Clone this repository: ```sh git clone https://github.com/redii/grepo-tools.git```
2. Install dependencies: ```sh bun install```
3. Create a config file: ```sh bun index.ts create-config``` (or copy the config.example.json manually)

### Get Config Values

Since some of the tools in this project need live data from within the game, which is not provided by the open Grepolis API, you have to provide an ingame session. So you have to extract some data out of an HTTP request from your browser. For this start up your browser, login to Grepolis and start the game. Now do the following...

1. Open the dev tools of your browser
2. Select the network tab to inspect the HTTP requests made by the game
3. Open the Ranking Overview (this starts to send HTTP request displayed in the dev tools)
4. Click on the first request, which has been made by this
5. Extract the following data from this request
   a. Worlds Name (e.g. en162)
   b. Town ID (e.g. 3771)
   c. H Token (e.g. a694e69...)
   d. Cookie (e.g. metricsUvId=...; cid=...; sid=...;)
6. Put this session data in your config.json file

![Extract Data from HTTP request](https://github.com/redii/grepo-tools/blob/main/assets/extract_session_from_http_request.jpg)

## Usage

```sh bun index.ts --help```

