const bedrock = require('bedrock-protocol')
const express = require('express')
const app = express()
app.get('/', (req,res) => res.send('Bot Moving Fixed'))
app.listen(3000, () => console.log('Web OK'))

function start() {
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
    console.log('Bot joined! Movement FIXED - will show in game now')
    
    setInterval(() => {
      tick++
      const yaw = Math.random()*360
      console.log(`Bot moving tick ${tick} yaw ${yaw.toFixed(0)}`)

      client.queue('player_auth_input', {
        pitch: 0,
        yaw: yaw,
        position: pos,
        move_vector: { x: Math.random()*0.6-0.3, z: Math.random()*0.6-0.3 },
        head_yaw: yaw,
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
    }, 2000)
  })

  client.on('close', () => { console.log('Disconnected, retry 10s'); setTimeout(start, 10000) })
  client.on('error', (e) => { console.log('Error', e.message); setTimeout(start, 10000) })
}

start()

