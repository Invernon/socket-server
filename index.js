// Importing Express
const express = require('express');
const app = express();
var PORT = process.env.PORT || 3000;

// const server = require('websocket').server;

app.get('/', (req, res) => {
  res.send('Hello World');
});

// const httpServer = http.createServer(() => { });
// httpServer.listen(1337, () => {
//   console.log('Server listening at port 1337');
// });

// const wsServer = new server({
//   httpServer,
// });

app.listen(PORT, () => console.log(`Server running at: http://localhost:${PORT}/`)); 

let clients = [];

// wsServer.on('request', request => {
//   const connection = request.accept();
//   const id = Math.floor(Math.random() * 100);

//   clients.forEach(client => client.connection.send(JSON.stringify({
//     client: id,
//     text: 'I am now connected',
//   })));

//   clients.push({ connection, id });

//   connection.on('message', message => {
//     clients
//       .filter(client => client.id !== id)
//       .forEach(client => client.connection.send(JSON.stringify({
//         client: id,
//         text: message.utf8Data,
//       })));
//   });

//   connection.on('close', () => {
//     clients = clients.filter(client => client.id !== id);
//     clients.forEach(client => client.connection.send(JSON.stringify({
//       client: id,
//       text: 'I disconnected',
//     })));
//   });
// });