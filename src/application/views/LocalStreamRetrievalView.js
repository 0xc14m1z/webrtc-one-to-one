function LocalStreamRetrievalView(application) {

  let $takingMediaLoader
  let $retakeContainer
  let $retakeButton
  let $retakingMediaLoader

  render()
  setReferences()
  addEventsListeners()

  getLocalStream()

  function render() {
    application.render(`
      <div id="local-stream-retrieval" class="screen">
        <span class="loader big"></span>
        <div id="retake" class="hidden">
          <div class="message error">
            You must grant access to your webcam and microphone to use this application
          </div>
          <button>
            Access webcam <span class="loader hidden"></span>
          </button>
        </div>
      </div>
    `)
  }

  function setReferences() {
    $takingMediaLoader = document.querySelector('#local-stream-retrieval > .loader')
    $retakeContainer = document.querySelector('#local-stream-retrieval #retake')
    $retakeButton = document.querySelector('#local-stream-retrieval button')
    $retakingMediaLoader = document.querySelector('#local-stream-retrieval button > .loader')
  }

  function addEventsListeners() {
    $retakeButton.addEventListener('click', performRetake)
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
    $retakeContainer.classList.remove('hidden')
    $retakeButton.disabled = false
    $retakingMediaLoader.classList.add('hidden')
  }

  function performRetake() {
    $retakeButton.disabled = true
    $retakingMediaLoader.classList.remove('hidden')

    getLocalStream()
  }

}

module.exports = LocalStreamRetrievalView
