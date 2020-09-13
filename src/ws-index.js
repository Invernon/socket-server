const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
// uWebSockets.js is binary by default
const { StringDecoder } = require('string_decoder');
const decoder = new TextDecoder('utf8');
const port = 8080;

const MESSAGE_ENUM = Object.freeze({
    SELF_CONNECTED: "SELF_CONNECTED",
    CLIENT_CONNECTED: "CLIENT_CONNECTED",
    CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
    CLIENT_MESSAGE: "CLIENT_MESSAGE"
})

let wsTimeout = null;
// ...


CLIENTS = [];

let settings = { key_file_name: "misc/key.pem", cert_file_name: "misc/cert.pem", passphrase: '1234' }
const server = https.createServer({
    cert: fs.readFileSync('src/misc/cert.pem'),
    key: fs.readFileSync('src/misc/key.pem')
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
   
    ws.send('something');
});

server.listen(port, (listenSocket) => {
        listenSocket ?
            console.log(`Listening to port ${port}`) :
            console.log(`Failed to listen to port ${port}`);
})

// const app = uWS.SSLApp(settings).ws('/*', {
//     compression: 0,
//     maxPayloadLength: 16 * 1024 * 1024,
//     idleTimeout: 0,

//     open: (ws, req) => {
//         ws.id = Math.random() * 1000;
//         ws.username = createName(getRandomInt());
//         // subscribe to topics
//         ws.subscribe(MESSAGE_ENUM.CLIENT_CONNECTED);
//         ws.subscribe(MESSAGE_ENUM.CLIENT_DISCONNECTED);
//         ws.subscribe(MESSAGE_ENUM.CLIENT_MESSAGE);

//         // Clients on server
//         CLIENTS.push(ws);
//         // indicate message type so the client can filter with a switch statement later on
//         let selfMsg = {
//             type: MESSAGE_ENUM.SELF_CONNECTED,
//             body: {
//                 id: ws.id,
//                 name: ws.username
//             }
//         }
//         let pubMsg = {
//             type: MESSAGE_ENUM.CLIENT_CONNECTED,
//             body: {
//                 id: ws.id,
//                 name: ws.username
//             }
//         }
//         // send to connecting socket only
//         ws.send(JSON.stringify(selfMsg));

//         // send to *all* subscribed sockets
//         // app.publish(MESSAGE_ENUM.CLIENT_CONNECTED, pubMsg)

//         // send to connecting socket
//         // socket.send(JSON.stringify(msg));
//     },
//     message: (ws, message, isBinary) => {
//         /* In this simplified example we only have drawing commands */
//         console.log('Message', message, false);
//         // app.publish("drawing/canvas1", message, true);
//         // decode message from client
//         let clientMsg = JSON.parse(decoder.decode(message));
//         let serverMsg = {};

//         switch (clientMsg.type) {
//             case MESSAGE_ENUM.CLIENT_MESSAGE:
//                 serverMsg = {
//                     type: MESSAGE_ENUM.CLIENT_MESSAGE,
//                     sender: ws.username,
//                     body: clientMsg.body
//                 };

//                 app.publish(MESSAGE_ENUM.CLIENT_MESSAGE, JSON.stringify(serverMsg));
//                 break;
//             default:
//                 console.log("Unknown message type.");
//         }
//     },
// });
// // finally listen using the app on port 3000
// app.listen(port, (listenSocket) => {
//     listenSocket ?
//         console.log(`Listening to port ${port}`) :
//         console.log(`Failed to listen to port ${port}`);
// })

// functions to help us generate random usernames
function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(9999));
}

function createName(randomInt) {
    return CLIENTS.find(ws => ws.name === `user-${randomInt}`) ? createName(getRandomInt()) : `user-${randomInt}`
}
