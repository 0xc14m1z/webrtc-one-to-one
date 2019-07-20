function EventsEmitter() {
  this.handlers = {}
}

EventsEmitter.prototype.on = function on(event, handler) {
  if ( !this.handlers[event] ) this.handlers[event] = []
  this.handlers[event].push(handler)
}

EventsEmitter.prototype.emit = function emit(event, ...payload) {
  const handlers = this.handlers[event] || []
  handlers.forEach(function run(handler) {
    if ( typeof handler === 'function' ) handler.call(this, ...payload)
  })
}

module.exports = EventsEmitter
