const Messages = require('../../common/messages')

function onSendRecipientDescriptor(client, { to, sdp }) {
  this.getClientByUsername(to)
      .send(Messages.recipientDescriptorReceived(client.username, sdp))
}

module.exports = onSendRecipientDescriptor
