const dotenv = require('dotenv');
const { botApp } = require('./app');

try {
  dotenv.config();
  const port = process.env.PORT;
  const url = process.env.BOT_URL;
  botApp(url).listen(port, () => {
    console.log(`App server is now listening on ${port} !`);
  });
} catch (error) {
  console.log(`Error is:\n${error}`);
  process.exitCode = 1;
}
