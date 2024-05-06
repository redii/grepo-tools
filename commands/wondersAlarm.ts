import type { GrepoToolsConfig } from "../types"

import { Database } from "bun:sqlite"

const wonders = [
  {
    name: "great_pyramid_of_giza",
    label: "Great Pyramid Of Giza",
  },
  {
    name: "colossus_of_rhodes",
    label: "The Colossus of Rhodes",
  },
  {
    name: "lighthouse_of_alexandria",
    label: "The Lighthouse at Alexandria",
  },
  {
    name: "temple_of_artemis_at_ephesus",
    label: "The Temple of Artemis at Ephesus",
  },
  {
    name: "hanging_gardens_of_babylon",
    label: "The Hanging Gardens of Babylon",
  },
  {
    name: "mausoleum_of_halicarnassus",
    label: "The Mausoleum of Halicarnassus",
  },
  {
    name: "statue_of_zeus_at_olympia",
    label: "Statue of Zeus at Olympia",
  },
];

export default (config: GrepoToolsConfig, options: Object) => {
  try {
    console.info(`[${new Date().toISOString()}] Starting wonders alarm for ${config.world}...`);
    const db = new Database(`./data/${config.world}.db`);
    scrape(options, config, db);
    setInterval(() => scrape(options, config, db), options.interval);
  } catch(err) {
    console.error(err);
  }
}

async function scrape(options: Object, config: GrepoToolsConfig, db: Database) {
  const response = await fetch(`https://${config.world}.grepolis.com/game/frontend_bridge?town_id=${config.town_id}&action=fetch&h=${config.h}&json=%7B%22window_type%22%3A%22world_wonders_info%22%2C%22tab_type%22%3A%22ranking%22%2C%22known_data%22%3A%7B%22models%22%3A%5B%22Player%22%5D%2C%22collections%22%3A%5B%22CustomColors%22%5D%2C%22templates%22%3A%5B%5D%7D%2C%22town_id%22%3A30835%2C%22nl_init%22%3Atrue%7D`, {
    method: "GET",
    headers: config.headers,
  });
  const data = await response.json();
  const now = new Date();

  if (data.json.redirect) throw new Error(`[${new Date().toISOString()}] ❌ Session expired, please renew the cookie!`);

  const wondersData = data.json.models.WondersRanking.data;
  const lastWondersDataEntry = await db.query("SELECT * FROM WondersRequest ORDER BY createdAt DESC LIMIT 1").get();
  const lastWondersData = lastWondersDataEntry ? (JSON.parse(lastWondersDataEntry.data)).json.models.WondersRanking.data : undefined;
  db.query("INSERT INTO WondersRequest (data) VALUES ($data)").run(JSON.stringify(data));

  for (const alliance of wondersData.ranking) {
    const allianceLastTime = lastWondersData?.ranking.find((a) => a.alliance_id === alliance.alliance_id);
    if (allianceLastTime) {
      for (const wonder of wonders) {
        if (alliance[wonder.name].level > allianceLastTime[wonder.name].level) {
          // log wonder upgrade to console
          console.info(`[${new Date().toISOString()}] 🚨 ${alliance.alliance_name} has upgraded ${wonder.label} from ${allianceLastTime[wonder.name].level} to ${alliance[wonder.name].level}`);

          // send request to webhook if configured
          if (config.webhooks?.default || config.webhooks?.wondersAlarm) {
            await fetch(options.webhook || config.webhooks?.wondersAlarm || config.webhooks?.default, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: "GrepoTools",
                avatar_url: "https://raw.githubusercontent.com/redii/grepo-tools/main/assets/zeus.png",
                embeds: [
                  {
                    title: `🚨 ${alliance.alliance_name} - ${wonder.label}`,
                    description: `${wonder.label} has been upgraded by ${alliance.alliance_name}`,
                    color: 15548997,
                    thumbnail: { url: `https://${config.world}.grepolis.com/image.php?alliance_id=${alliance.alliance_id}` },
                    fields: [
                      {
                        name: "From Level",
                        value: `${allianceLastTime[wonder.name].level}`,
                        inline: true
                      },
                      {
                        name: "To Level",
                        value: `**${alliance[wonder.name].level}**`,
                        inline: true
                      }
                    ],
                    footer: { text: now.toLocaleString("de") }
                  }
                ]
              }),
            });
          }
        }
      }
    }
  }
}