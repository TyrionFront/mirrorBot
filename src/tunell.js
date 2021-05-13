import ngrok from 'ngrok';
// eslint-disable-next-line import/no-extraneous-dependencies
import nodemon from 'nodemon';
import dotenv from 'dotenv';
import 'regenerator-runtime';

const launch = async () => {
  dotenv.config();
  const addr = process.env.PORT;
  process.env.BOT_URL = await ngrok.connect({ addr });
  const url = process.env.BOT_URL;

  nodemon({
    script: 'src/server.js',
    exec: `NGROK_URL=${url} babel-node --presets @babel/preset-env`,
  }).on('start', () => {
    console.log(`The tunnel has started and working on ${url}`);
  }).on('quit', () => {
    console.log('The application has quit, closing ngrok tunnel');
    ngrok.kill().then(() => process.exit(0));
  });
};

try {
  launch();
} catch (error) {
  console.log(`Error is:\n${error}`);
  process.exitCode = 1;
}
