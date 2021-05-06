import http from 'http'
import { connect }   from './src/client'
import { keepAlive } from './src/keepalive';

/* Make sure to set these environment variables 
 * in both your .env file (for development) and 
 * your app.yaml file (for deployment to app engine).
 */
const appURL   = process.env.APP_URL,
      proxyURL = process.env.PROXY_URL,
      fullURL  = `https://${proxyURL}/${appURL}`,
      interval = 1000 * 60; // 5 minutes.

// If required URLs are present, start keepAlive service.
if (appURL && proxyURL) keepAlive(fullURL, interval);

connect(); // Initial startup of our Discord.js bot.

const httpPort = process.env.PORT || 8080,
      server   = http.createServer(resHandler);

server.listen(httpPort, () => {
  console.info('Now listening on port:', httpPort)
});

function resHandler(req, res) {
  /* Handler for incoming http requests. The connect() 
   * method runs with each new request, restarting the 
   * Discord.js client when nessecary.
   */
  try {
    const status = connect();
    res.writeHead(200);
    res.end(JSON.stringify(status));
  } catch(err) { res.writeHead(500); res.end(err) }
}
