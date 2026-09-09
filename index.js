const bedrock = require('bedrock-protocol')
const express = require('express')
const app = express()
app.get('/', (req,res) => res.send('Bot Moving'))
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
  let tick = 0

  client.on('move_player', (packet) => {
    // Save any position server sends us
    if (packet.position) {
      pos = packet.position
      console.log(`Got position: ${pos.x.toFixed(1)} ${pos.y.toFixed(1)} ${pos.z.toFixed(1)}`)
    }
  })

  client.on('spawn', () => {
    console.log('Bot joined! Anti-AFK started - you will see bot in game now')
    
    setInterval(() => {
      tick++
      console.log(`Bot moving... tick ${tick} at ${pos.x.toFixed(0)},${pos.z.toFixed(0)}`)
      
      // This packet makes bot look around and move slightly
      try {
        client.write('player_auth_input', {
          pitch: Math.random()*20 -10,
          yaw: Math.random()*360,
          position: pos,
          move_vector: { x: (Math.random()-0.5), z: (Math.random()-0.5) },
          head_yaw: Math.random()*360,
          input_data: { _value: 0n },
          input_mode: 'mouse',
          play_mode: 'normal',
          tick: BigInt(tick),
          delta: { x:0, y:0, z:0 }
        })
      } catch(e) { console.log('Move error', e.message) }
    }, 2000)
  })

  client.on('text', (packet) => {
    console.log(`Chat: ${packet.message}`)
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
