const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Bot is ONLINE'));
app.listen(process.env.PORT || 10000);

const bedrock = require('bedrock-protocol');
function start() {
  const client = bedrock.createClient({
    host: 'play.hexagonsmp.fun',
    port: 25571,
    username: 'HexagonBot',
    offline: true,
    version: '1.21.70'
  });
  client.on('spawn', () => console.log('BOT SPAWNED SUCCESS!'));
  client.on('close', () => setTimeout(start, 5000));
  client.on('error', console.log);
}
start();
