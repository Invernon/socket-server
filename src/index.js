let app = require("express")();
let http = require("http").Server(app);
let ss = require('socket.io-stream');
let io = require("socket.io")(http);

const users = [];

io.on("connection", (socket) => {
  // Log whenever a user connects
  socket.broadcast.emit('broadcast', 'New person on!');
  // socket.broadcast.emit('broadcast', () => {
  //   io.send('broadcast', 'New person on!');
  // });

  console.log("user connected");

  // ss(socket).on('voice', (stream, data) => {
  //   let filename = path.basename(data.name);
  //   stream.pipe( fs.createWriteSteam(filename) )
  // })

  // Log whenever a client disconnects from our websocket server
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });


  // When we receive a 'message' event from our client, print out
  // the contents of that message and then echo it back to our client
  // using `io.emit()`
  socket.on("message", (message) => {
    console.log("Message Received: " + message);
    io.emit("message", { type: "new-message", text: JSON.parse(message) });

  });
});

// Initialize our websocket server on port 5000
http.listen(8080, "192.168.0.162", () => {
  console.log("started on port 192.168.0.162:8080");
});


//// HTTPS TRY 

// let app = require("express")();
// let http = require("http").Server(app);
// let https = require("https");
// var path = require('path');
// var fs = require('fs');
// let ss = require('socket.io-stream');
// // let io = require("socket.io")(httpsServer);

// const options = {
//   key: fs.readFileSync(path.resolve('src/ssl/server.key') , 'utf8' ),
//   cert: fs.readFileSync(path.resolve('src/ssl/server.crt') , 'utf8' )
// };

// var httpsServer = https.createServer( options, app);
// let io = require("socket.io")(httpsServer);

// const users = [];

// io.on("connection", (socket) => {
//   // Log whenever a user connects
//   socket.broadcast.emit('broadcast', 'New person on!');
//   // socket.broadcast.emit('broadcast', () => {
//   //   io.send('broadcast', 'New person on!');
//   // });

//   console.log("user connected");

//   ss(socket).on('voice', (stream, data) => {
//     let filename = path.basename(data.name);
//     stream.pipe( fs.createWriteSteam(filename) )
//   })

//   // Log whenever a client disconnects from our websocket server
//   socket.on("disconnect", function () {
//     console.log("user disconnected");
//   });


//   // When we receive a 'message' event from our client, print out
//   // the contents of that message and then echo it back to our client
//   // using `io.emit()`
//   socket.on("message", (message) => {
//     console.log("Message Received: " + message);
//     io.emit("message", { type: "new-message", text: JSON.parse(message) });

//   });
// });

// // Initialize our websocket server on port 5000
// httpsServer.listen( 8080, "192.168.0.162", () => {
//   console.log("started on port 192.168.0.162:8080");
// });