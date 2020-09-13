
const MESSAGE_ENUM = Object.freeze({
  SELF_CONNECTED: "SELF_CONNECTED",
  CLIENT_CONNECTED: "CLIENT_CONNECTED",
  CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
  CLIENT_MESSAGE: "CLIENT_MESSAGE",
});

(function () {
    "use strict";
  
    let connection;
  
    const setupWebSocketConnection = () => {
      connection = new WebSocket('wss://192.168.0.162:8080');
  
      connection.onopen = () => {
        alert('CONNECTED')
        let msg = {
          type: 'CLIENT_CONNECTED',
          body: 'Connected'
        }
        connection.send( JSON.stringify(msg) );
      };
  
      connection.onerror = error => {
        console.log(`An error occured: ${error}`)
      };
  
      connection.onmessage = message => {
        console.log( message )
        // addMessageToConsole(`Client${data.client} says: ${data.text}`)
      };
    }
  
    const closeConnection = () => {
      connection.close();
      addMessageToConsole('You disconnected!');
      enableAndDisableButtons(false);
    }  
  
    document.addEventListener('click', async event => {
      if (event.target.id === 'start') {
        setupWebSocketConnection();
      } else if (event.target.id === 'say-hello') {
        connection.send('Hello!');
      } else if (event.target.id === 'close') {
        closeConnection();
      }
    });
  })();