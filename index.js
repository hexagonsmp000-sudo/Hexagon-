const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot ONLINE'));
app.listen(process.env.PORT || 10000);

const bedrock = require('bedrock-protocol');

function startBot() {
  console.log('Connecting...');
  const client = bedrock.createClient({
    host: 'hexgonsmp.aternos.me',
    port: 14363,
    username: 'HexagonBot_24x7',
    offline: true,
    skipPing: true
  });

  client.on('join', () => {
    console.log('✅ BOT JOINED SUCCESS - Will never leave!');
  });

  client.on('spawn', () => {
    console.log('✅ SPAWNED INSIDE SMP');
  });

  // NEVER disconnect on player join/leave
  client.on('close', (reason) => {
    console.log('Server closed:', JSON.stringify(reason));
    console.log('Reconnecting in 5 sec...');
    setTimeout(startBot, 5000);
  });

  client.on('error', (err) => {
    console.log('Error, reconnecting...', err.message);
    setTimeout(startBot, 5000);
  });

  // Anti-AFK - REAL MOVING
  setInterval(() => {
    try {
      if (client.entity) {
        // Swing arm so Aternos sees activity
        client.write('animate', {
          action_id: 1,
          runtime_id: client.entity.runtimeId
        });
        console.log('Keeping alive... swing arm');
      }
    } catch(e) {
      console.log('AFK error', e.message);
    }
  }, 30000); // every 30 sec - keeps bot from getting kicked
}

startBot();
