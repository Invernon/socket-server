(function () {
    "use strict";
  
    let connection;
  
    const enableAndDisableButtons = (connected) => {
      document.getElementById('start').disabled = connected;
      document.getElementById('say-hello').disabled = !connected;
      document.getElementById('close').disabled = !connected;
    }
  
    const setupWebSocketConnection = () => {
      connection = new WebSocket('ws://localhost:1337');
  
      connection.onopen = () => {
        addMessageToConsole('You are now connected!');
        enableAndDisableButtons(true);
      };
  
      connection.onerror = error => {
        console.log(`An error occured: ${error}`)
      };
  
      connection.onmessage = message => {
        const data = JSON.parse(message.data);
        addMessageToConsole(`Client${data.client} says: ${data.text}`)
      };
    }
  
    const closeConnection = () => {
      connection.close();
      addMessageToConsole('You disconnected!');
      enableAndDisableButtons(false);
    }
  
    const addMessageToConsole = message => {
      const messageDiv = document.createElement('div');
      messageDiv.textContent = message;
      document.getElementById('console').appendChild(messageDiv);
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