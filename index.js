const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

const key = process.env.BOT_KEY || 'hankey';
const name = process.env.BOT_NAME || 'JimmySanBot';
const lName = name.toLowerCase();

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

const muted = [];

function sendMessage(chatId, message, replyTo = undefined, markdown = false) {
  const msg = {
    chat_id: chatId,
    text: message
  };

  if (replyTo !== undefined) {
    msg.reply_to_message_id = replyTo;
  }

  if (markdown) {
    msg.parse_mode = 'markdown';
  }
    
  request.post(`https://api.telegram.org/bot${key}/sendMessage`, { json: msg });
}

app.post(`/bot/${key}`, function(req, res) {
  const update = req.body;
  
  if (update.message === undefined || update.message.text === undefined) {
    res.sendStatus(200);
    return;
  }

  const text = update.message.text.toLowerCase();
  const chatId = update.message.chat.id;
  const msgId = update.message.message_id;

  const index = muted.indexOf(chatId);

  if (index !== -1) {
    if (text == '/unmute' || text == `/unmute@${lName}`) {
      muted.splice(index, 1);
      sendMessage(chatId, `\`systemctl start ${lName}.service\``, undefined, true);
    }
    res.sendStatus(200);
    return;
  }

  if (text == '/mute' || text == `/mute@${lName}`) {
    muted.push(chatId);
    sendMessage(chatId, `\`systemctl stop ${lName}.service\``, undefined, true);
    res.sendStatus(200);
    return;
  }

  const triggered = triggers.filter(item => {
    return text.includes(item);
  }).forEach(item => {
    sendMessage(chatId, `${item} merda 💩`, msgId);
  });

  res.sendStatus(200);
});

app.get('/', function(req, res) {
  res.sendStatus(404);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
