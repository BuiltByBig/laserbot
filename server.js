import express from 'express'
import http from 'http'
import serialport, { SerialPort } from 'serialport'
import socketio from 'socket.io'

const app = express()
const server = http.Server(app)
const io = socketio(server)

app.set('views', './views')
app.set('view engine', 'jade')
app.use(express.static('./public', { index: false }))

app.get('/', (req, res) => {
  res.render('index.jade')
})

const PORT = '/dev/cu.wchusbserial1420'

io.on('connection', (socket) => {
  console.log('a user connected')

  io.emit('response', `opening ${PORT} port`)


  // List serial ports
  serialport.list((err, ports) => {
    ports.forEach((port) => io.emit('available port', port))
  })


  // Connect to port
  const conn = new SerialPort(PORT, {
    baudrate: 115200,
    openImmediately: false,
    parser: serialport.parsers.readline('\r\n')
  })

  conn.on('open', () => {
    io.emit('response', 'opened')

    socket.on('message', (data) => {
      console.log('data', data)
      conn.write(data + '\r\n', (err, result) => {
        console.log('err', err)
        console.log('result', result)
      })
    })
  })

  conn.on('data', (data) => {
    console.log('data', data)
    io.emit('response', data)
  })

  conn.on('error', (err) => {
    io.emit('response', `error: ${err}`)
  })

  conn.on('close', async () => {
    io.emit('response', 'closed')
    await attemptReconnect(conn, io)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
})

//-----------------------------------
// Hacky reconnect logic
//-----------------------------------
// TODO: allow multiple connection retries
async function attemptReconnect(conn, io, options = { maxRetries: 10 }) {

  const { maxRetries } = options
  let retries = 0

  function reconnect(delay) {
    io.emit('response', 'trying to reconnect...')
    console.log('trying to reconnect')

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        conn.open((err, data) => {
          if (err) {
            console.log('error reconnecting', err)
            return reject(err)
          }

          resolve('reconnected')
        })
      }, delay)
    })
  }

  let delay = 1000
  while (retries < maxRetries) {
    console.log('reconnect attempt #' + (retries + 1) + ' (delay ' + delay + ')')

    try {
      if (await reconnect(delay)) {
        io.emit('response', 'reconnected!')
        console.log('reconnected!')
        retries = maxRetries
        return
      }
    } catch (err) {
      console.log('reconnect err', err)
    }

    delay += 500
    retries += 1
  }
}



server.listen(3000, () => {
  console.log('listening on *:3000')
})
