const MessageType = require('./messageTypes')
const encodeMessage = require('./encodeMessage')

function usernameTaken() {
  return encodeMessage(MessageType.USERNAME_TAKEN)
}

function connected() {
  return encodeMessage(MessageType.CONNECTED)
}

module.exports = {
  usernameTaken,
  connected
}