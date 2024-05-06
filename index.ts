#! /usr/bin/env bun

import type { GrepoToolsConfig } from "./types"

import { Database } from "bun:sqlite"
import { program } from "commander"
import * as commands from "./commands"

program
  .name("grepo")
  .description("A collection of tools for the browser game Grepolis by InnoGames");

program.command("create-config")
  .description("initialize a new config file under a given path")
  .option("-p, --path <path>", "Path to the config file you want to create (defaults to ./config.json)", "./config.json")
  .action((options) => init("createConfig", options));

program.command("wonders-alarm")
  .description("start an alarm which notifies you when a wonder has been upgraded")
  .option("-c, --config <path>", "Path to the config file you want to use (defaults to config.json)", "config.json")
  .option("-i, --interval <number>", "Interval in milliseconds to check for upgrades (defaults to 60000)", "60000")
  .option("-w, --webhook <url>", "Discord Webhook URL to send notifications to (can also be configured within the config file)")
  .action((options) => init("wondersAlarm", options));

program.parse();

async function init(command: string, options: Object, args?: Object) {
  try {
    // check if command exists
    if (!(command in commands)) throw new Error("Command not found.");

    // skip database setup and config parsing when creating config
    if (command === "createConfig") {
      commands.createConfig(options);
      return;
    }

    // read config file and parse it
    const configFile = Bun.file(options.config);
    if (!configFile.exists()) throw new Error("Config file not found.");
    const config: GrepoToolsConfig = await configFile.json();

    // setup database if needed
    const db = new Database(`./data/${config.world}.db`, { create: true });
    const schemaFile = Bun.file(`./schema.sql`);
    const schema = await schemaFile.text();
    const query = db.query(schema);
    query.run();

    // execute command with config
    (commands as { [key: string]: Function })[command](config, options, args);
  } catch(err) {
    console.error(err);
  }
}