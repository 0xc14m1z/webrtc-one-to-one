const decodeMessage = require('../common/decodeMessage')
const handlersMap = require('./handlersMap')

function onMessage(client, rawMessage) {
  console.log('Got a new message:')
  console.log(rawMessage)

  const { type, payload } = decodeMessage(rawMessage)

  if ( type in handlersMap ) {
    handlersMap[type].call(this, client, payload)
  }
}

module.exports = onMessage
