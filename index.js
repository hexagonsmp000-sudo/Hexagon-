const bedrock = require('bedrock-protocol')
const express = require('express')

// Keep Render alive
const app = express()
app.get('/', (req,res) => res.send('HexgonBot is Keeping Server ON - Timer Resets'))
app.listen(3000, () => console.log('Web OK - Bot Service Live'))

let botOnlineTime = 0

function startBot() {
  console.log('------------------------------------------------')
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
    botOnlineTime = Date.now()
    console.log('✅ BOT JOINED! Aternos timer RESET! Server will stay ON')
    console.log('Bot will stay for 4 minutes then rejoin to reset timer')
    
    // Anti-AFK - just look around, safe no kick
    const moveInterval = setInterval(() => {
      tick++
      try {
        client.queue('player_auth_input', {
          pitch: (Math.random()-0.5)*10,
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
          transaction: undefined,
          item_stack_request: undefined,
          block_actions: undefined,
          vehicle_rotation: { x: 0, z: 0 },
          analog_move_vector: { x: 0, z: 0 },
          camera_orientation: { x: 0, y: 0, z: 0 },
          raw_move_vector: { x: 0, z: 0 }
        })
      } catch(e) {}
    }, 3000)

    // Stay 4 minutes then leave to reset timer cleanly
    setTimeout(() => {
      console.log('Bot leaving after 4 min, will rejoin in 20 sec to reset timer again')
      clearInterval(moveInterval)
      client.close()
    }, 240000) // 4 minutes = 240000ms
  })

  client.on('close', () => {
    const onlineFor = Math.floor((Date.now() - botOnlineTime)/1000)
    console.log(`Bot left after ${onlineFor}s. Aternos timer will start. Rejoining in 30 sec to RESET timer`)
    setTimeout(startBot, 30000) // Rejoin after 30 sec - resets Aternos 5 min timer
  })

  client.on('error', (e) => {
    console.log('Error:', e.message, '- Retrying in 30 sec')
    setTimeout(startBot, 30000)
  })
}

startBot()
