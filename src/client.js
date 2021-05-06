import Discord from 'discord.js'
import dayjs   from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import todoHandler  from './todo'

// Useful for calculating an elapsed-time duration.
dayjs.extend(relativeTime);

// When AppEngine kills our bot, this variable
// will reset back to being undefined.
let uptime;

export default function() {
  /** ## Main Connection Loop ##
   *  If/when our bot is killed by Google's AppEngine,
   *  this loop will reset and reconnect to Discord.
   */

  if (!uptime) {
    // Configure client, variables and options.
    const client   = new Discord.Client(),
          apiToken = process.env.DISCORD_API_TOKEN,
          oauthurl = 'https://discord.com/oauth2/authorize?',
          authlink = (id) => oauthurl + `client_id=${id}&scope=bot`;

    if (!apiToken) throw Error('No API token is set!');
    
    // Client "ready" loop.
    client.on("ready", () => {
      console.log('Discord.js bot is now running.');
      console.info(`Use ${authlink(client.user.id)} to invite this bot onto your server.`);
    });

    // Client event handlers.
    client.on('message', msg => todoHandler(msg));

    // Client login to Discord.
    client.login(apiToken);

    // Set our global timer.
    uptime = dayjs();

    // setInterval(() => {
    //   console.info(`Still alive for ${dayjs(uptime).fromNow(true)}.`);
    // }, 1000 * 60);
  }

  return { uptime: dayjs(uptime).fromNow(true) };
}