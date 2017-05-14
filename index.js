const express = require('express')
const app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

const key = process.env.botkey;

app.post(`/bot/${key}`, function(request, response) {
  console.log(request.body);
});

app.get('/', function(request, response) {
  response.sendStatus(404);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
