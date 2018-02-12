var textarea = document.querySelector(".chat-textarea");
var chatn = document.querySelector(".chat-name");
var span = document.querySelector("span");
var messages = document.querySelector(".chat-messages")

var socket = io.connect('http://127.0.0.1:8080');
var def = span.textContent;
var setStatus = function(data){
  span.textContent = data;
  if(data !== def){
    var delay = setTimeout(function(){
      setStatus(def);
      clearInterval(delay);
    }, 3000);
  }
}

setStatus("testing")

if(socket !== undefined){

  //Listen for output
  socket.on("output", function(data){
    if(data.length){
      for (var i = 0; i < data.length; i++) {
        var message = document.createElement("div");

        message.setAttribute("class", "chat-message");
        message.textContent = data[i].name + ": " + data[i].message;

        messages.appendChild(message);
        //messages.insertBefore(message, message.firstChild);
      }
    }
  });

  socket.on("status", function(data){
    setStatus((typeof data === 'object') ? data.message : data);
    if(data.clear === true){
      textarea.value= "";
    }
  });
  textarea.addEventListener("keydown", function(event){
    if(event.which === 13 && event.shiftKey === false){
      socket.emit("input", {name: chatn.value, message: this.value});
      //this.value = "";
    }
  });
}
