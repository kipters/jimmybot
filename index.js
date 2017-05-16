const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

const key = process.env.BOT_KEY || 'hankey';
const name = process.env.BOT_NAME || 'JimmySanBot';
const inlineImage = process.env.INLINE_IMAGE || 'poo.jpg';
const inlineThumb = process.env.INLINE_THUMB || 'poo_thumb.jpg';
const lName = name.toLowerCase();

const triggerWords = [
  "javascript",
  "docker",
  "systemd",
  "wordpress",
  "java",
  "js",
  "php",
  "python",
  "lisp",
  "clojure",
  "node",
  "angular",
  "react",
  "npm",
  "perl",
  "pascal",
  "cobol",
  "windows",
  "dotnet",
  "go",
  "golang",
  "lua",
  "rust",
  "asp",
  "mac",
  "macos",
  "osx"
];

function formatMessage(item) {
  return `${item} merda 💩`;
}

function formatInlineResult(text) {
  return {
    type: 'photo',
    id: text,
    photo_url: inlineImage,
    thumb_url: inlineThumb,
    caption: formatMessage(text)
  };
}

const triggers = new RegExp(`\\b(${triggerWords.join('|')})\\b`, 'gi');

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

if (process.env.NODE_ENV === 'development') {
  sendMessage = function(chatId, message, replyTo = undefined, markdown = false) {
    console.log(message);
  };
}

app.post(`/bot/${key}`, function(req, res) {
  const update = req.body;

  console.log(JSON.stringify(update));

  if (update.inline_query) {
    const query = update.inline_query;

    const result = {
      inline_query_id: query.id,
      next_offset: ""
    };

    if (query.query === undefined || query.query === "") {
      result.results = triggerWords.slice(0, 50).map(formatInlineResult)
    } else {
      result.results = triggerWords
        .filter(i => i.includes(query.query))
        .slice(0, 50)
        .map(formatInlineResult);
    }

    result.method = 'answerInlineQuery';
    res.send(result);
    return;
  }
  
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

  const triggered = text.match(triggers);

  if (triggered) {
    triggered.forEach(item => {
      sendMessage(chatId, formatMessage(item), msgId);
    });
  }

  res.sendStatus(200);
});

app.get('/', function(req, res) {
  res.sendStatus(404);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
