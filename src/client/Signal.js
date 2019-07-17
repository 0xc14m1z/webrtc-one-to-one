function Signal() {
  this.eventHandlers = {}
}

Signal.prototype.on = function on(event, handler) {
  if ( !this.eventHandlers[event] ) this.eventHandlers[event] = []
  this.eventHandlers[event].push(handler)
}

Signal.prototype.emit = function emit(event, ...payload) {
  const handlers = this.eventHandlers[event] || []
  handlers.forEach(function run(handler) {
    if ( typeof handler === 'function' ) handler.call(this, ...payload)
  })
}

module.exports = Signal
