const TelegramBot = require('node-telegram-bot-api');

const token = '6161910706:AAFvPzM2RJemzpB40F-MDVOu06a-MRAPJn4';
const bot = new TelegramBot(token, {polling: false});

function alert_user(chat_id){
    bot.sendMessage(chat_id, 'Ваш аккаунт одобрен администатором')
}

module.exports={
    alert_user
}