var http = require("http"),
    express = require("express"),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server)
    message = require("./models/message");


app.use(express.static("public"));

io.on("connection", function(socket){
  socket.emit("newMessage", { value: true });

  socket.on("newClientMessage", function(data){
    console.log(data);
    //Save message with mongoose
    newMessage = new Message({ text: data.message })
    newMessage.save(function(err){
      if(err){
        value = err;
      }else{
        value = data.message
      }
      io.sockets.emit("savedMessage", { value: true,  message: value });
    })
  });

  socket.on("loadMessages", function(){
    Message.find({}, function(err, docs){
      socket.emit("loadMessages", { messages: docs })
    });
  });

  socket.on("destroyMessages", function(){
    Message.find({}, function(err, docs){
      for (var i = docs.length - 1; i >= 0; i--) {
        docs[i].remove();
      };
    });
    io.emit("destroyMessages", {});
  })
});

server.listen(3000);
