const Messages = require('../../common/messages')

// { "type": "c", "payload": "username" }
function onConnect(client, username) {
  if ( !this.isUsernameAvailable(username) ) {
    client.send(Messages.usernameTaken())
  } else {
    client.username = username
    client.send(Messages.connected())
  }
}

module.exports = onConnect
