const mineflayer = require('mineflayer')
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Bot is Alive!'))
app.listen(3000, () => console.log('Web server started'))

const botConfig = {
  host: 'hexgonsmp.aternos.me',
  port: 14363,
  username: 'HexgonBot',
  version: false // auto version
}

function createBot() {
  const bot = mineflayer.createBot(botConfig)

  bot.on('spawn', () => {
    console.log('Bot joined!')

    // Anti-AFK - Move every 5 sec
    setInterval(() => {
      bot.setControlState('forward', true)
      bot.setControlState('jump', true)
      bot.look(Math.random() * 360, 0)
      
      setTimeout(() => {
        bot.setControlState('forward', false)
        bot.setControlState('jump', false)
      }, 2000)
    }, 10000)

    // Chat every 20 min to show alive
    setInterval(() => {
      bot.chat('Bot is active - Server alive!')
    }, 20 * 60 * 1000)
  })

  bot.on('end', () => {
    console.log('Bot disconnected, reconnecting in 10 sec...')
    setTimeout(createBot, 10000)
  })

  bot.on('error', (err) => console.log(err))
}

createBot()
