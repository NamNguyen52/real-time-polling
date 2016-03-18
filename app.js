var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
// Adding socket.io
var io = require('socket.io')(http);
var db = require('./models/db');
var feed;
// On connection to the socket, just invoking the function.
io.on('connection',function(socket) {
  feed = require('./models/feeds')(socket);
});

/**
  Adding the controllers.
*/
var dbModel = new db();
dbModel.setupDb();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/view'));
app.use(require('./controllers'));

http.listen(3000, function(){
  console.log('listening on port 3000');
});
