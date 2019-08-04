const Messages = require('../../common/messages')

function onRequestCall(client, recipient) {
  if ( this.isUsernameAvailable(recipient) ) {
    client.send(Messages.unknownRecipient())
  } else {
    this.getClientByUsername(recipient)
        .send(Messages.callRequested(client.username))
  }
}

module.exports = onRequestCall
