const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Bot is ONLINE - hexgonsmp.aternos.me');
});

app.listen(PORT, () => {
  console.log(`Web server running on ${PORT}`);
});

const bedrock = require('bedrock-protocol');

function startBot() {
  console.log('Trying to connect to hexgonsmp.aternos.me:14363...');
  
  const client = bedrock.createClient({
    host: 'hexgonsmp.aternos.me',
    port: 14363,
    username: 'HexagonBot',
    offline: true,
    skipPing: true,
    connectTimeout: 30000
  });

  client.on('spawn', () => {
    console.log('✅ BOT SPAWNED SUCCESS! Bot is inside your SMP!');
    
    // Send message every 30 minutes
    setInterval(() => {
      try {
        client.queue('text', {
          type: 'chat',
          needs_translation: false,
          source_name: client.username,
          xuid: '',
          platform_chat_id: '',
          message: 'Server is 24/7 ONLINE! ⚡'
        });
        console.log('Sent 24/7 message in chat');
      } catch(e) {
        console.log('Chat error:', e.message);
      }
    }, 30 * 60 * 1000); // 30 mins
  });

  client.on('text', (packet) => {
    console.log(`<${packet.source_name}> ${packet.message}`);
  });

  client.on('close', (reason) => {
    console.log('Disconnected:', reason);
    console.log('Reconnecting in 10 seconds...');
    setTimeout(startBot, 10000);
  });

  client.on('error', (err) => {
    console.log('ERROR:', err.message);
  });
}

startBot();
