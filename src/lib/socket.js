export default () => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket('ws://localhost:8989/ws')

    socket.onopen = (e) => {
      resolve(socket)
    }
  })
}
