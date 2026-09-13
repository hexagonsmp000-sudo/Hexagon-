const bedrock = require('bedrock-protocol')
const express = require('express')

const app = express()
app.get('/', (req,res) => res.send('Bot is running - Server is UP'))
app.listen(process.env.PORT || 3000, () => console.log('Web server OK'))

function startBot() {
  console.log('Trying to join hexgonsmp.aternos.me:14363')
  
  const client = bedrock.createClient({
    host: 'hexgonsmp.aternos.me',
    port: 14363,
    username: 'HexgonBot',
    offline: true,
    version: '1.21.90'
  })

  client.on('spawn', () => {
    console.log('✅ BOT JOINED! Your server will stay ON now')
    let yaw = 0
    setInterval(() => {
      yaw += 30
      if (yaw > 360) yaw = 0
      try {
        client.queue('player_auth_input', {
          pitch: 0,
          yaw: yaw,
          head_yaw: yaw,
          position: client.position,
          move_vector: { x: 0, z: 1 },
          input_data: { _value: 0, is_sneaking: false },
          input_mode: 'mouse',
          play_mode: 'screen',
          interaction_model: 'touch',
          gaze: undefined,
          interact_rotation: { x: 0, y: 0, z: 0 }
        })
      } catch {}
    }, 1000)
  })

  client.on('close', () => {
    console.log('Disconnected, retry in 10s')
    setTimeout(startBot, 10000)
  })

  client.on('error', (e) => {
    console.log('Error', e.message)
  })
}

startBot()
