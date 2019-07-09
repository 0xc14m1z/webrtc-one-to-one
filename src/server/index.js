const WebSocket = require('ws')

const onClose = require('./onClose')
const onMessage = require('./onMessage')
const onError = require('./onError')

const socket = new WebSocket.Server({
  port: process.env.PORT || 8888
})

socket.on('connection', client => {
  client.on('close', onClose)
  client.on('message', onMessage)
  client.on('error', onError)
})
