const Messages = require('../../common/messages')

function onSendCallerDescriptor(client, { to, sdp }) {
  this.getClientByUsername(to)
      .send(Messages.callerDescriptorReceived(client.username, sdp))
}

module.exports = onSendCallerDescriptor
