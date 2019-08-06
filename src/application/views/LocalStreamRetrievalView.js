function LocalStreamRetrievalView(application) {

  let $takingMediaLoader
  let $errorMessage

  render()
  setReferences()

  getLocalStream()

  function render() {
    application.render(`
      <div id="local-stream-retrieval" class="screen">
        <span class="loader big"></span>
        <div class="message error hidden">
          You must grant access to your webcam and microphone to use this application.
        </div>
      </div>
    `)
  }

  function setReferences() {
    $takingMediaLoader = document.querySelector('#local-stream-retrieval .loader')
    $errorMessage = document.querySelector('#local-stream-retrieval .message')
  }

  function getLocalStream() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                          .then(onStream)
                          .catch(onError)
  }

  function onStream(stream) {
    application.client.setLocalStream(stream)
  }

  function onError() {
    $takingMediaLoader.classList.add('hidden')
    $errorMessage.classList.remove('hidden')
  }

}

module.exports = LocalStreamRetrievalView
