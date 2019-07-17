function Signal() {
  this.eventHandlers = {}
}

Signal.prototype.on = function on(event, handler) {
  if ( !this.eventHandlers[event] ) this.eventHandlers[event] = []
  this.eventHandlers[event].push(handler)
}

module.exports = Signal
