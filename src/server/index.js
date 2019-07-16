const WebSocket = require('ws')

const onClose = require('./onClose')
const onMessage = require('./onMessage')
const onError = require('./onError')

const socket = new WebSocket.Server({
  port: process.env.PORT || 8888
})

socket.isUsernameAvailable = function(username) {
  return !Array.from(this.clients)
               .find(client => client.username === username)
}

socket.on('connection', client => {
  client.on('close', onClose)
  client.on('message', onMessage.bind(socket, client))
  client.on('error', onError)
})
