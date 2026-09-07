const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server on ${PORT}`));

const bedrock = require('bedrock-protocol');
async function startBot() {
  console.log('Starting bot...');
  try {
    const client = bedrock.createClient({
      host: 'play.hexagonsmp.fun',
      port: 25571,
      username: 'HexagonBot',
      offline: true,
      version: '1.21.70'
    });
    client.on('spawn', () => console.log('BOT SPAWNED!'));
    client.on('close', () => setTimeout(startBot, 5000));
    client.on('error', (e) => console.log(e));
  } catch(e) { console.log(e); setTimeout(startBot, 5000); }
}
startBot();
