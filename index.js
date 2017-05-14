const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

const key = process.env.botkey || 'hankey';

const triggers = [
  "js",
  "javascript",
  "docker",
  "systemd",
  "php",
  "python",
  "lisp",
  "clojure",
  "node",
  "angular",
  "react",
  "java",
  "npm",
  "perl",
  "pascal",
  "cobol",
  "windows",
  "dotnet",
  "go",
  "golang",
  "c++",
  "lua",
  "rust",
  "asp",
];

app.post(`/bot/${key}`, function(req, res) {
  const update = req.body;
  
  if (update.message === undefined || update.message.text === undefined) {
    res.sendStatus(200);
    return;
  }

  const text = update.message.text.toLowerCase();
  const chatId = update.message.chat.id;
  const msgId = update.message.message_id;

  const triggered = triggers.filter(item => {
    return text.includes(item);
  }).forEach(item => {
    const msg = {
      chat_id: chatId,
      text: `${item} merda 💩`,
      reply_to_message_id: msgId
    };
    
    request.post(`https://api.telegram.org/bot${key}/sendMessage`, { json: msg });
  });

  res.sendStatus(200);
});

app.get('/', function(req, res) {
  res.sendStatus(404);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
