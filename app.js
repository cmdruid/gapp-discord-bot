import express from 'express'
import connect from './src/client'

connect(); // Initial startup of bot.

const app  = express(),
      port = process.env.PORT || 8080;

app.get('/', (req, res, next) => {
  /* We re-run connect() with each
     new request to the server. */
  try {
    const status = connect();
    res.status(200).json(status);
  } catch(err) { res.status(500).text(err) }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
