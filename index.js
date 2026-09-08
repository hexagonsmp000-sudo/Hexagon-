
const express = require('express');
const app = express();
app.get('/', (req,res)=> res.send('Bot is ONLINE'));
app.listen(process.env.PORT || 10000, ()=>console.log('Web server on 10000'));

const bedrock = require('bedrock-protocol');
function start() {
 console.log('Trying to connect to play.hexagonsmp.fun:25571...');
 const client = bedrock.createClient({
  host: 'hexgonsmp.aternos.me',
port: 14363,
   username: 'HexagonBot',
   offline: true
 });
 client.on('spawn', () => console.log('BOT SPAWNED SUCCESS! Bot is in server'));
 client.on('text', (p) => console.log(`<${p.source_name}> ${p.message}`));
 client.on('close', (e) => { console.log('Disconnected:', e); setTimeout(start, 5000); });
 client.on('error', (e) => console.log('ERROR:', e.message));
}
start();
