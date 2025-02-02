const Client = require('../client/Client')
const {
  ConnectionView,
  LocalStreamRetrievalView,
  CallView
} = require('./views')

function Application() {
  console.log('Launching...')

  this.root = document.getElementById('root')
  this.view = null

  this.client = new Client('ws://localhost:8888')
  this.client.on(Client.OPEN, onOpen.bind(this))
  this.client.on(Client.CLOSE, onOpen.bind(this))
  this.client.on(Client.ERROR, onOpen.bind(this))

  this.client.on(Client.CONNECTED, onConnection.bind(this))
  this.client.on(Client.LOCAL_STREAM, onLocalStream.bind(this))
}

function onOpen() {
  console.log('Ready to connect')

  this.view = new ConnectionView(this)
}

function onConnection() {
  console.log('Connected')

  this.view = new LocalStreamRetrievalView(this)
}

function onLocalStream() {
  console.log('Got local stream')

  this.view = new CallView(this)
}

Application.prototype.render = function render(html) {
  this.root.innerHTML = html
}

Application.prototype.start = function start() {
  this.client.openConnection()
}

module.exports = Application
