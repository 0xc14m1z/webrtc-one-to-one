const sinon = require('sinon')

function MediaStream() {
  return {
    addTrack: MediaStream.addTrack
  }
}

MediaStream.addTrack = sinon.spy()

module.exports = MediaStream
