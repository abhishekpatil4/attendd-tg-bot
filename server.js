const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();


// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Define a command handler for '/start'
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  console.log('ChatID: ' + chatId);
  bot.sendMessage(chatId, 'Welcome to Attendd Bot!\nPlease enter your USN and DOB in the following format:\n/login <usn> <YYYY-MM-DD>');
});

// Define a command handler for '/login'
bot.onText(/\/login (.+) (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = match[1];
  const password = match[2];

  // Send a message to the user indicating that the login process has started
  bot.sendMessage(chatId, 'Logging in...');

  try {
    // Make a GET request to fetch personal details
    const personalResponse = await axios.get(`${process.env.API}/personal/username=${username}_and_password=${password}`);

    // Send personal details to the user
    const { name, semester, usn, credits_earned, credits_to_earn } = personalResponse.data;
    const personalMessage = `Name: ${name}\nSemester: ${semester}\nUSN: ${usn}\nCredits Earned: ${credits_earned}\nCredits to Earn: ${credits_to_earn}`;
    bot.sendMessage(chatId, personalMessage);
    bot.sendMessage(chatId, 'Fetching course details...');

    // Make a GET request to fetch attendance details
    const attendanceResponse = await axios.get(`${process.env.API}/attendance/username=${username}_and_password=${password}`);

    // Send attendance details to the user
    const attendanceData = attendanceResponse.data;
    const attendanceMessage = attendanceData.map(course => `Course Name: ${course.course_name}\nCIE Marks: ${course.cie_marks}\nAttendance: ${course.course_attendance}\n`).join('\n');
    bot.sendMessage(chatId, attendanceMessage);

    //sending command so that user can copy paste
    const command = `/login ${username} ${password}`;
    bot.sendMessage(chatId, command);

  } catch (error) {
    // Send an error message to the user if there is an error in fetching details
    bot.sendMessage(chatId, 'Error: Invalid credentials or failed to fetch details. Please try again.');
  }
});

