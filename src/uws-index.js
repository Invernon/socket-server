const uWS = require('uWebSockets.js');
// uWebSockets.js is binary by default
const { StringDecoder } = require('string_decoder');
const decoder = new TextDecoder('utf8');
const port = 7777;

const MESSAGE_ENUM = Object.freeze({
    SELF_CONNECTED: "SELF_CONNECTED",
    CLIENT_CONNECTED: "CLIENT_CONNECTED",
    CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
    CLIENT_MESSAGE: "CLIENT_MESSAGE"
})

let wsTimeout = null;
// ...


CLIENTS = [];


// an "app" is much like Express.js apps with URL routes,
// here we handle WebSocket traffic on the wildcard "/*" route
const app = uWS.SSLApp({}).ws('/ws', {
    compression: 0,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 0,

    open: (ws, req) => {
        // const ping = () => {
        //     clearTimeout(wsTimeout);
        //     let msg = {
        //         type: MESSAGE_ENUM.PING
        //     }
        //     ws.send(JSON.stringify(msg));
        // }

        // wsTimeout = setTimeout(ping, 50000);

        ws.id = Math.random() * 1000;
        ws.username = createName(getRandomInt());

        // subscribe to topics
        ws.subscribe(MESSAGE_ENUM.CLIENT_CONNECTED);
        ws.subscribe(MESSAGE_ENUM.CLIENT_DISCONNECTED);
        ws.subscribe(MESSAGE_ENUM.CLIENT_MESSAGE);

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

        // send to *all* subscribed sockets
        // app.publish(MESSAGE_ENUM.CLIENT_CONNECTED, pubMsg)

        // send to connecting socket
        // socket.send(JSON.stringify(msg));
    },
    message: (ws, message, isBinary) => {
        /* In this simplified example we only have drawing commands */
        console.log('Message', message, false);
        // app.publish("drawing/canvas1", message, true);
        // decode message from client
        let clientMsg = JSON.parse(decoder.decode(message));
        let serverMsg = {};

        switch (clientMsg.type) {
            case MESSAGE_ENUM.CLIENT_MESSAGE:
                serverMsg = {
                    type: MESSAGE_ENUM.CLIENT_MESSAGE,
                    sender: ws.username,
                    body: clientMsg.body
                };

                app.publish(MESSAGE_ENUM.CLIENT_MESSAGE, JSON.stringify(serverMsg));
                break;
            default:
                console.log("Unknown message type.");
        }
    },

    // close handler
    // close: (ws, code, message) => {
    //     SOCKETS.find((sk, index) => {
    //         if (sk && sk.id === ws.id) {
    //             SOCKETS.splice(index, 1);
    //         }
    //     });

    //     let pubMsg = {
    //         type: MESSAGE_ENUM.CLIENT_DISCONNECTED,
    //         body: {
    //             id: ws.id,
    //             name: ws.name
    //         }
    //     }

    //     app.publish(MESSAGE_ENUM.CLIENT_DISCONNECTED, JSON.stringify(pubMsg));
    // }

    // handle messages from client
    // message: (socket, message, isBinary) => {

    //     // parse JSON and perform the action
    //     let json = JSON.parse(decoder.write(Buffer.from(message)));
    //     switch (json.action) {
    //         case 'join': {
    //             // subscribe to messages in said drawing room
    //             socket.subscribe(json.room);
    //             break;
    //         }
    //         case 'draw': {
    //             // draw something in drawing room
    //             app.publish(json.room, json.message);
    //             break;
    //         }
    //         case 'leave': {
    //             // unsubscribe from the said drawing room
    //             socket.unsubscribe(json.room);
    //             break;
    //         }
    //     }
    // }

});
// finally listen using the app on port 3000
app.listen(port, (listenSocket) => {
    listenSocket ?
        console.log(`Listening to port ${port}`) :
        console.log(`Failed to listen to port ${port}`);
})


// functions to help us generate random usernames
function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(9999));
}

function createName(randomInt) {
    return CLIENTS.find(ws => ws.name === `user-${randomInt}`) ? createName(getRandomInt()) : `user-${randomInt}`
}