/* eslint-disable camelcase */
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');


function botApp(url) {
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
    if (!part.startsWith('/')) {
      bot.sendMessage(id, text);
      return;
    }
    const currentCommand = commandsAndResponses[part];
    const responseText = currentCommand
      ? commandsAndResponses[part](rest.join(' ')) : `No command "${part}" was recognized`;
    bot.sendMessage(id, responseText);
  });

  bot.on('animation', (anima) => {
    const { chat: { id }, animation: { file_id } } = anima;
    bot.sendAnimation(id, file_id);
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
}

module.exports = { botApp };
