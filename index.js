const bedrock = require('bedrock-protocol')
const express = require('express')
const app = express()

app.get('/', (req,res) => res.send('Bot Online'))
app.listen(3000, () => console.log('Web OK'))

const config = {
  host: 'hexgonsmp.aternos.me',
  port: 14363,
  username: 'HexgonBot',
  offline: true
}

function start() {
  const client = bedrock.createClient(config)
  
  client.on('spawn', () => {
    console.log('Bot joined!')
    setInterval(() => {
      client.queue('player_auth_input', {
        pitch: Math.random()*20,
        yaw: Math.random()*360,
        position: client.entity.position,
        move_vector: { x: Math.random()-0.5, z: Math.random()-0.5 },
        head_yaw: Math.random()*360,
        input_data: { _value: 0n },
        input_mode: 'mouse',
        play_mode: 'normal',
        interaction_model: 'classic',
        gaze_direction: undefined,
        tick: 0n,
        delta: { x:0, y:0, z:0 }
      })
    }, 5000)
  })
  
  client.on('close', () => setTimeout(start, 10000))
  client.on('error', console.log)
}
start()
