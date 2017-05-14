const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

const key = process.env.botkey;

app.post(`/bot/${key}`, function(request, response) {
  console.log(JSON.stringify(request.body));
  respo.sendStatus(200);
});

app.get('/', function(request, response) {
  response.sendStatus(404);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
