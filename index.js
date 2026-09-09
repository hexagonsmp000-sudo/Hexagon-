const bedrock = require('bedrock-protocol')
const express = require('express')
const app = express()
app.get('/', (req,res) => res.send('Bot Live'))
app.listen(3000, () => console.log('Web OK'))

function start() {
  console.log('Connecting to hexgonsmp.aternos.me:14363')
  const client = bedrock.createClient({
    host: 'hexgonsmp.aternos.me',
    port: 14363,
    username: 'HexgonBot',
    offline: true
  })

  let lastPos = null

  // Save position when server sends it
  client.on('move_player', (packet) => {
    if (packet.runtime_id === client.entityId) {
      lastPos = packet.position
    }
  })

  client.on('spawn', () => {
    console.log('Bot joined! Starting movement in 3 seconds')
    
    setTimeout(() => {
      setInterval(() => {
        if (!lastPos) {
          console.log('Waiting for position...')
          return
        }
        console.log(`Bot moving at ${lastPos.x.toFixed(1)}, ${lastPos.z.toFixed(1)}`)
        
        client.queue('player_auth_input', {
          pitch: 0,
          yaw: Math.random()*360,
          position: lastPos,
          move_vector: { x: Math.random()-0.5, z: Math.random()-0.5 },
          head_yaw: Math.random()*360,
          input_data: { _value: 0n },
          input_mode: 'mouse',
          play_mode: 'normal',
          tick: 0n,
          delta: { x:0, y:0, z:0 }
        })
      }, 5000)
    }, 3000)
  })

  client.on('close', () => {
    console.log('Disconnected, retry in 10s')
    setTimeout(start, 10000)
  })
  client.on('error', (e) => {
    console.log('Error:', e.message)
    setTimeout(start, 10000)
  })
}

start()
