const bedrock = require('bedrock-protocol')
const express = require('express')
const app = express()
app.get('/', (req,res) => res.send('Bot is Live and Moving'))
app.listen(3000, () => console.log('Web OK - Service is live'))

function start() {
  console.log('Connecting to hexgonsmp.aternos.me:14363')
  const client = bedrock.createClient({
    host: 'hexgonsmp.aternos.me',
    port: 14363,
    username: 'HexgonBot',
    offline: true
  })

  client.on('spawn', () => {
    console.log('Bot joined! Starting anti-AFK movement')
    
    setInterval(() => {
      const pos = client.entity.position
      console.log(`Bot moving at ${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`)
      
      // This makes bot look around and do small steps - anti AFK
      client.queue('player_auth_input', {
        pitch: Math.random()*10,
        yaw: Math.random()*360,
        position: pos,
        move_vector: { x: (Math.random()-0.5)*0.5, z: (Math.random()-0.5)*0.5 },
        head_yaw: Math.random()*360,
        input_data: { _value: 0n },
        input_mode: 'mouse',
        play_mode: 'normal',
        tick: 0n,
        delta: { x:0, y:0, z:0 }
      })
    }, 5000)
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
