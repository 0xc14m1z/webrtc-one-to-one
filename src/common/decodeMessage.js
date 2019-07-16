function decodeMessage(rawMessage) {
  try {
    return JSON.parse(rawMessage)
  } catch (_) {
    return {}
  }
}

module.exports = decodeMessage