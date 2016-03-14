var socket = io()

var messages = document.getElementById('messages')
function appendMessage(msg) {
  var p = document.createElement('p')
  var content = document.createTextNode(msg);
  p.appendChild(content)
  //messages.insertBefore(p, messages.firstChild)
  messages.appendChild(p)
}
socket.on('response', appendMessage)




var ports = document.getElementById('ports')
function listPort(port) {
  var p = document.createElement('p')
  var content = document.createTextNode(port.comName)
  p.appendChild(content)
  ports.appendChild(p)
}
socket.on('available port', listPort)




var form = document.getElementById('form')
var input = document.getElementById('input')
function submitValue() {
  socket.emit('message', input.value)
  appendMessage('[SENT] ' + input.value)
  input.value = ''
}
// Handle cmd+enter submit
input.addEventListener('keydown', function (e) {
  if (event.metaKey && event.keyCode == 13) {
    console.log('command + enter')
    submitValue()
  }
})
// Handle standard submit
form.addEventListener('submit', function (e) {
  e.preventDefault()
  submitValue()
})
