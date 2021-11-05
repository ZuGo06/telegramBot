const TelegramApi = require('node-telegram-bot-api');
const token = '2139714110:AAEGmgyDpKMj8l6b5ucbrnNlMBlXPUEo0gQ';
const{gameOptions, againOptions} = require('./options')

const bot = new TelegramApi(token, {polling: true})

const chats = {};



const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен отгадать!')
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
  bot.setMyCommands( [
    {command: '/start', description: "Приветствие"},
    {command: '/info', description: "Информация о пользователе"},
    {command: '/game', description: "Игра угадай цифру"},
  
  ])
  
  bot.on('message', async msg => {
     const text = msg.text;
     const chatId = msg.chat.id;
  
  
  
    if (text === "/start") {
        await bot.sendSticker(chatId, 'https://tgram.ru/wiki/stickers/img/CoolGuy/gif/15.gif')
        return bot.sendMessage(chatId, 'Добро пожаловать на мини-проект Али, который был разработан для души')
    }

    if (text === "/info") {
        return bot.sendMessage(chatId, `Мне кажется, или тебя вроде зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }

    if (text === "/game") {
        return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я вас не понял, попробуйте еще раз!");

  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if(data === '/again') {
      return startGame(chatId)
    }
 
    if(data === chats[chatId]) {
      return await bot.sendMessage(chatId, `Вы угадали цифру ${chats[chatId]}`, againOptions)
    } else {
      return bot.sendMessage(chatId, `К сожалению вы не угадали, бот загадал цифру ${chats[chatId]}`, againOptions)
    }

    
    
  })
}

start()
