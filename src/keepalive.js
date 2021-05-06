import https from 'https';

let timer;

export function keepAlive(url, interval) {
  /** Runs a heartbeat method at the set interval. */
  clearInterval(timer);
  timer = setInterval(heartBeat, interval, url);
  console.info('Starting keep-alive service...');
}

function heartBeat(url) {
  /* Sends a request to our proxy service, which 
   * gets forwarded back to our main http listener.
   */
  let buffer = ""; 
  
  try {
    https.get(url, res => {
      res.on('data', data => buffer += data);
      res.on('end', () => resHandler(buffer));
    });
  } catch(err) { console.error(err) }
}

function resHandler(buffer) {
  /** When in dev mode, log response to console. */
  const devMode = process.env.NODE_ENV !== 'production',
        resData = JSON.parse(buffer);
  if (devMode) console.log(`Current uptime: ${resData.uptime}`);
}