const MessageType = require('../common/messageTypes')
const Handlers = require('./handlers')

module.exports = {
  [MessageType.CONNECT]: Handlers.onConnect,
  [MessageType.REQUEST_CALL]: Handlers.onRequestCall
}
