const bedrock = require('bedrock-protocol')
const express = require('express')
const app = express()
app.get('/', (req,res) => res.send('Bot is Live'))
app.listen(3000, () => console.log('Web OK - Service is live'))

function start() {
  console.log('Trying to connect to hexgonsmp.aternos.me:14363')
  try {
    const client = bedrock.createClient({
      host: 'hexgonsmp.aternos.me',
      port: 14363,
      username: 'HexgonBot',
      offline: true,
      connectTimeout: 10000
    })

    client.on('spawn', () => {
      console.log('Bot joined! Success!')
    })

    client.on('close', () => {
      console.log('Server offline/closed, retrying in 10s...')
      setTimeout(start, 10000)
    })

    client.on('error', (e) => {
      console.log('Connect error:', e.message)
      setTimeout(start, 10000)
    })

  } catch (e) {
    console.log('Failed:', e.message)
    setTimeout(start, 10000)
  }
}

start()
