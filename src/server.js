/* eslint-disable dot-notation */
import botApp from './app';
import 'regenerator-runtime';

try {
  const port = process.env.PORT || 8001;
  const url = process.env.BOT_URL_HEROKU || process.env.BOT_URL;
  botApp(url).listen(port, () => {
    console.log(`App server is now listening on ${port} !`);
  });
} catch (error) {
  console.log(`Error is:\n${error}`);
  process.exitCode = 1;
}
