const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

const key = process.env.botkey;

const triggers = [
  "js",
  "javascript",
  "docker",
  "systemd"
];

app.post(`/bot/${key}`, function(request, response) {
  const update = request.body;
  
  if (body.message === undefined || body.message.text === undefined) {
    response.sendStatus(200);
    return;
  }

  const text = body.message.text;
  const chatId = body.chat_id;
  const msgId = body.message_id;

  const triggered = triggers.filter(item => {
    return text.includes(item);
  }).forEach(item => {
    const msg = {
      chat_id: chatId,
      text: `${item} merda 💩`,
      reply_to_message_id: msgId
    };
    
    request.post(`https://api.telegram.org/bot${botkey}/sendMessage`, { json: msg });
  });

  response.sendStatus(200);
});

app.get('/', function(request, response) {
  response.sendStatus(404);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
