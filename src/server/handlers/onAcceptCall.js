const Messages = require('../../common/messages')

function onAcceptCall(client, caller) {
  this.getClientByUsername(caller)
      .send(Messages.callAccepted(client.username))
}

module.exports = onAcceptCall
