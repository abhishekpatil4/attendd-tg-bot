const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();


// Create a new bot instance
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Store the previous command
let previousCommand = '';

// Handle incoming messages
bot.on('message', (message) => {
  // Store the command in case we need to send it again
  if (message.text.startsWith('/')) {
    previousCommand = message.text;
  }

  // Send the keyboard with the button to the user
  bot.sendMessage(message.chat.id, 'Press the button:', { reply_markup: { inline_keyboard: [[{ text: 'Previous command!', callback_data: 'button_clicked' }]] } });
});

// Handle button clicks
bot.on('callback_query', (query) => {
  // Send the previous command again to the bot
  bot.sendMessage(query.message.chat.id, previousCommand);
});
