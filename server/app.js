'use strict';

var WebSocketServer = require("ws").Server
var http = require("http")
var app = require('express')();

var index = require('./routes/index');

app.use('/', index);

var server = http.createServer(app)

var wss = new WebSocketServer({server: server})

wss.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('New Subscription', function(msg){
    console.log('New subscription: ' + msg);
  });
});

app.set("port", (process.env.PORT || 5000));

server.listen(app.get("port"), () => {
    console.log("Listening on port: " + app.get("port"));
});

module.exports = app;
