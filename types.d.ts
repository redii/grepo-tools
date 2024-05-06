export interface GrepoToolsConfig {
  world: string,
  townid: string,
  h: string,
  headers: {
    "Cookie": string,
    "User-Agent": string,
    "Accept": string,
    "Accept-Language": string,
    "x-requested-with": string,
    "sec-fetch-dest": string,
    "sec-fetch-mode": string,
    "sec-fetch-site": string,
    "te": string,
  },
  webhooks?: {
    default?: string,
    wondersAlarm?: string,
  }
}