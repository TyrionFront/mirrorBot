/* eslint-disable camelcase */
import express from 'express';
import TelegramBot from 'node-telegram-bot-api';


export default (url) => {
  const bot = new TelegramBot(process.env.BOT_TOKEN);
  bot.setWebHook(`${url}/bot`);

  const app = express();
  app.use(express.json());

  let updId = 0;
  app.post('/bot', (req, res) => {
    const { body } = req;
    const { update_id } = body;
    if (updId !== update_id) {
      updId = update_id;
      bot.processUpdate(body);
    }
    res.send('');
  });

  const commandsAndResponses = {
    '/start': () => 'Started !',
    '/help': text => text || 'call 911',
    '/pin_msg': () => {},
  };

  bot.on('message', (msg) => {
    const { chat: { id }, text = '' } = msg;
    const [part, ...rest] = text.split(' ');
    if (!part || part === '/pin_msg') {
      return;
    }
    const currentCommand = commandsAndResponses[part];
    const responseText = currentCommand ? commandsAndResponses[part](rest.join(' ')) : part;
    bot.sendMessage(id, responseText);
  });

  bot.onText(/\/pin_msg (.+)/, (msg) => {
    const { chat: { id }, message_id } = msg;
    bot.pinChatMessage(id, message_id);
  });

  bot.on('error', (err) => {
    console.log(`Error occured here: ${err.message}`);
    throw new Error(err);
  });

  return app;
};
