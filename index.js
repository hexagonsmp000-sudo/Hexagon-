const bedrock = require('bedrock-protocol')
const express = require('express')

const app = express()
app.get('/', (req,res) => res.send('HexgonBot 24/7 ONLINE'))
app.listen(3000, () => console.log('Web OK'))

function startBot() {
  console.log('Connecting to hexgonsmp.aternos.me:14363')
  
  const client = bedrock.createClient({
    host: 'hexgonsmp.aternos.me',
    port: 14363,
    username: 'HexgonBot',
    offline: true
  })

  let pos = { x: 0, y: 80, z: 0 }
  let tick = 0n

  client.on('move_player', (p) => {
    if (p.position) pos = p.position
  })

  client.on('spawn', () => {
    console.log('------------------------------------------------')
    console.log('✅ BOT JOINED! Server will stay ON FOREVER')
    console.log('Bot will NEVER leave now')
    console.log('------------------------------------------------')
    
    setInterval(() => {
      tick++
      try {
        client.queue('player_auth_input', {
          pitch: (Math.random()-0.5)*20,
          yaw: Math.random()*360,
          position: pos,
          move_vector: { x: 0, z: 0 },
          head_yaw: Math.random()*360,
          input_data: { _value: 0n },
          input_mode: 'mouse',
          play_mode: 'normal',
          interaction_model: 'classic',
          interact_rotation: { x: 0, z: 0 },
          tick: tick,
          delta: { x: 0, y: 0, z: 0 },
        })
      } catch(e) {}
    }, 2000)

    // Send chat every 10 min so Aternos sees activity
    setInterval(() => {
      try { client.queue('text', { type: 'chat', message: 'HexgonBot keeping server alive!' }) } catch(e){}
    }, 600000)
  })

  client.on('close', () => {
    console.log('Disconnected! Rejoining in 15 sec...')
    setTimeout(startBot, 15000)
  })

  client.on('error', (e) => {
    console.log('Error:', e.message, ' - Rejoin in 15 sec')
    setTimeout(startBot, 15000)
  })
}

startBot()
