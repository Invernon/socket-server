const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
// uWebSockets.js is binary by default
const { StringDecoder } = require('string_decoder');
const socketIoStream = require('socket.io-stream');
const { client } = require('websocket');
const decoder = new TextDecoder('utf8');
const port = 5000;

const MESSAGE_ENUM = Object.freeze({
    SELF_CONNECTED: "SELF_CONNECTED",
    CLIENT_CONNECTED: "CLIENT_CONNECTED",
    CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
    CLIENT_MESSAGE: "CLIENT_MESSAGE"
})

let wsTimeout = null;
// ...


CLIENTS = [];

const server = https.createServer({
    cert: fs.readFileSync('src/misc/cert.pem'),
    key: fs.readFileSync('src/misc/key.pem')
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {

    console.log('new Connection');
    ws.id = Math.random() * 1000;
    ws.username = createName(getRandomInt());
    // ws.isMaster = false;

    // Clients on server
    CLIENTS.push(ws);

    // indicate message type so the client can filter with a switch statement later on
    let selfMsg = {
        type: MESSAGE_ENUM.SELF_CONNECTED,
        body: {
            id: ws.id,
            name: ws.username
        }
    }

    let pubMsg = {
        type: MESSAGE_ENUM.CLIENT_CONNECTED,
        body: {
            id: ws.id,
            name: ws.username
        }
    }

    // send to connecting socket only
    ws.send(JSON.stringify(selfMsg));

    ws.on('message', function incoming(message) {

        console.log(message);
        // decode message from client
        // let clientMsg = JSON.parse(message);
        // let serverMsg = {};

        // if (clientMsg.type && clientMsg.type === 'REQUEST_MASTER') {
        //     wss.clients.forEach(function each(client) {
        //         if (client !== ws && client.readyState === WebSocket.OPEN) {
        //             client.send(message);
        //         }
        //     });

        //     CLIENTS.find(e => e.name === clientMsg.body).send({
        //         type: 'YOU_ARE_MASTER',
        //         body: {
        //             master: true
        //         } 
        //     });
        // } else {

        // }

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });


        //   console.log('received: %s', message);
    });
});

server.listen(port, (listenSocket) => {
    console.log(`Listening to port ${port}`)
})

// functions to help us generate random usernames
function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(9999));
}

function createName(randomInt) {
    return CLIENTS.find(ws => ws.name === `user-${randomInt}`) ? createName(getRandomInt()) : `user-${randomInt}`
}
