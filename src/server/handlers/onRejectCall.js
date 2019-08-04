const Messages = require('../../common/messages')

function onRejectCall(client, caller) {
  this.getClientByUsername(caller)
      .send(Messages.callRejected(client.username))
}

module.exports = onRejectCall
