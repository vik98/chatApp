var mongo = require("mongodb").MongoClient;
var client = require("socket.io").listen(8080).sockets;

mongo.connect('mongodb://localhost/chatApp', function(err, database){
  if(err) return console.log(err);
  const mydb = database.db('chatApp');

  //Will wait for connection to the port
  client.on('connection', function(socket){
    //When someone connects
    var col = mydb.collection("messages");
    var sendStatus = function(s){
      socket.emit("status", s);
    }

    col.find().limit(100).sort({_id: 1}).toArray(function(err, res){
      if(err) throw err;
      socket.emit("output", res);
    })

    console.log("someone has conected");
    //when someone emits input from the socket
    socket.on("input", function(data){
      var name = data.name;
      var message = data.message;

      col.insert({name: name, message: message}, function(){
        console.log("inserted");
        client.emit("output", [data]);
        sendStatus({
          message: "Messag sent",
          clear: true
        });
      });
    });
  });
});
