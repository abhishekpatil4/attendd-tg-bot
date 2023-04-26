const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5856799741:AAFYZBl4IA4LlbiaUJqm9fYJ2hq7RxkLmdc';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Define a command handler for '/start'
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to Attendd Bot\nPlease enter your USN and DOB/password in the following format:\n/login <username> <password>');
});

// Define a command handler for '/login'
bot.onText(/\/login (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = match[1];
  const password = match[2];
  console.log('usern: ' + username);
  console.log('pass: ' + password)
//   if(username === "" || password === ""){
//     bot.sendMessage(chatId, 'Please enter your credentials');  
//   }
  // Send a message to the user indicating that the login process has started
  bot.sendMessage(chatId, 'Logging in...');

  try {
    // Make a GET request to fetch attendance details
    const response = await axios.get(`https://helloapi-ozaf.onrender.com/personal/username=${username}_and_password=${password}`);

    // Send attendance details to the user
    const { name, semester, usn, credits_earned, credits_to_earn } = response.data;
    const message = `Name: ${name}\nSemester: ${semester}\nUSN: ${usn}\nCredits Earned: ${credits_earned}\nCredits to Earn: ${credits_to_earn}`;
    bot.sendMessage(chatId, message);
  } catch (error) {
    // Send an error message to the user if there is an error in fetching attendance details
    bot.sendMessage(chatId, 'Error: Invalid credentials or failed to fetch attendance details. Please try again.');
  }
});
