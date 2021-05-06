import Discord from 'discord.js'
import dayjs   from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import todoHandler  from './todo'

/* If Google's app engine kills our bot, 
 * this variable will reset back to undefined.
 */
let uptime;

export function connect() {
  /** Main Connection Loop. */

  if (!uptime) {
    // Configure client, variables and options.
    const client   = new Discord.Client(),
          apiToken = process.env.DISCORD_API_TOKEN,
          oauthurl = 'https://discord.com/oauth2/authorize?',
          authlink = (id) => oauthurl + `client_id=${id}&scope=bot`;

    if (!apiToken) throw Error('No API token is set!');
    
    // Discord.js client "ready" loop.
    client.on("ready", () => {
      console.log('Discord.js bot is now running.');
      console.info(`Use ${authlink(client.user.id)} to invite this bot onto your server.`);
    });

    // Discord.js client event handlers.
    client.on('message', msg => todoHandler(msg));

    // Login to Discord using API token.
    client.login(apiToken);

    // Reset our global timer.
    uptime = dayjs();
  }
  // Return current uptime.
  return { uptime: getUptime() };
}

export function getUptime() {
  /** Helper function for displaying uptime. */
  dayjs.extend(relativeTime);
  return dayjs(uptime).fromNow(true);
}
