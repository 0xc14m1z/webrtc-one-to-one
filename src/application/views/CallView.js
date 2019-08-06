const Client = require('../../client/Client')
const MessageType = require('../../common/messageTypes')

function CallView(application) {

  let $localVideo
  let $remoteVideoContainer
  let $remoteVideo
  let $callRequestContainer
  let $unknownRecipientErrorMessage
  let $rejectedCallErrorMessage
  let $callRequestForm
  let $recipientInput
  let $callButton
  let $callingLoader
  let $connectingLoader
  let $dialogsContainer
  let $incomingCallDialog
  let $incomingCallDialogBody
  let $acceptCallButton
  let $rejectCallButton

  let currentCaller

  render()
  setReferences()
  addEventsListeners()

  application.client.on(MessageType.UNKNOWN_RECIPIENT, onUnknownRecipient)
  application.client.on(MessageType.CALL_REQUESTED, onCallRequested)
  application.client.on(MessageType.CALL_REJECTED, onCallRejected)
  application.client.on(MessageType.CALL_ACCEPTED, onCallAccepted)
  application.client.on(Client.REMOTE_STREAM, onRemoteStream)

  addStreamToVideo(application.client.localStream, $localVideo)

  function render() {
    application.render(`
      <div id="call">

        <div id="streams">

          <div id="local-stream">
            <div class="video-container">
              <video autoplay muted></video>
            </div>
          </div>

          <div id="remote-stream">

            <div class="video-container hidden">
              <video autoplay></video>
            </div>
            <div id="call-request-container">
              <span class="loader big hidden"></span>
              <div id="unknown-recipient-message" class="message error screen hidden">
                The recipient isn't connected.
              </div>
              <div id="rejected-call-message" class="message error screen hidden">
                The recipient rejected your call.
              </div>
              <form class="screen">
                <input type="text" name="recipient" placeholder="recipient" />
                <button disabled>
                  Call <span class="loader hidden"></span>
                </button>
              </form>
            </div>
          </div>

        </div>

        <div id="actions">
          <button>Next</button>
        </div>

        <div id="dialogs" class="hidden">
          <div id="incoming-call-dialog" class="dialog hidden">
            <div class="dialog-body">
            </div>
            <div class="dialog-actions">
              <button id="accept-call">Accept</button>
              <button id="reject-call" class="secondary">Reject</button>
            </div>
          </div>
        </div>

      </div>
    `)
  }

  function setReferences() {
    $localVideo = document.querySelector('#local-stream video')
    $remoteVideoContainer = document.querySelector('#remote-stream .video-container')
    $remoteVideo = document.querySelector('#remote-stream video')
    $callRequestContainer = document.querySelector('#call-request-container')
    $unknownRecipientErrorMessage = document.querySelector('#unknown-recipient-message')
    $rejectedCallErrorMessage = document.querySelector('#rejected-call-message')
    $callRequestForm = document.querySelector('form')
    $recipientInput = document.querySelector('input')
    $callButton = document.querySelector('form button')
    $callingLoader = document.querySelector('form button .loader')
    $connectingLoader = document.querySelector('.loader.big')
    $dialogsContainer = document.querySelector('#dialogs')
    $incomingCallDialog = document.querySelector('#incoming-call-dialog')
    $incomingCallDialogBody = document.querySelector('#incoming-call-dialog .dialog-body')
    $acceptCallButton = document.querySelector('#accept-call')
    $rejectCallButton = document.querySelector('#reject-call')
  }

  function addEventsListeners() {
    $recipientInput.addEventListener('input', validateUsername)
    $callRequestForm.addEventListener('submit', performCall)
    $callButton.addEventListener('click', performCall)
    $acceptCallButton.addEventListener('click', acceptCall)
    $rejectCallButton.addEventListener('click', rejectCall)
  }

  function addStreamToVideo(stream, $video) {
    $video.srcObject = stream
  }

  function validateUsername() {
    $callButton.disabled = $recipientInput.value.trim() === ''
  }

  function performCall(event) {
    event.preventDefault()

    $unknownRecipientErrorMessage.classList.add('hidden')
    $rejectedCallErrorMessage.classList.add('hidden')
    $recipientInput.disabled = true
    $callButton.disabled = true
    $callingLoader.classList.remove('hidden')

    application.client.requestCall($recipientInput.value)
  }

  function onUnknownRecipient() {
    $unknownRecipientErrorMessage.classList.remove('hidden')
    $recipientInput.disabled = false
    $recipientInput.focus()
    $callButton.disabled = false
    $callingLoader.classList.add('hidden')
  }

  function onCallRequested(caller) {
    currentCaller = caller

    $dialogsContainer.classList.remove('hidden')
    $incomingCallDialogBody.innerHTML = `
      <p>
        <strong>${ currentCaller }</strong> is calling...
      </p>
    `
    $incomingCallDialog.classList.remove('hidden')
  }

  function acceptCall() {
    hideIncomingCallDialog()

    $callRequestForm.classList.add('hidden')
    $connectingLoader.classList.remove('hidden')

    application.client.acceptCall(currentCaller)
  }

  function onCallAccepted() {
    hideIncomingCallDialog()

    $callRequestForm.classList.add('hidden')
    $connectingLoader.classList.remove('hidden')
  }

  function rejectCall() {
    hideIncomingCallDialog()

    application.client.rejectCall(currentCaller)
    currentCaller = null
  }

  function onCallRejected() {
    hideIncomingCallDialog()

    $rejectedCallErrorMessage.classList.remove('hidden')
    $recipientInput.disabled = false
    $recipientInput.focus()
    $callButton.disabled = false
    $callingLoader.classList.add('hidden')
  }

  function hideIncomingCallDialog() {
    $dialogsContainer.classList.add('hidden')
    $incomingCallDialog.classList.add('hidden')
    $incomingCallDialogBody.innerHTML = ''
  }

  function onRemoteStream(stream) {
    $connectingLoader.classList.add('hidden')
    $callRequestContainer.classList.add('hidden')
    $remoteVideoContainer.classList.remove('hidden')

    addStreamToVideo(stream, $remoteVideo)
  }

}

module.exports = CallView
