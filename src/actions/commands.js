import connect from '../lib/socket'

export const SEND_COMMAND = 'SEND_COMMAND'

export function sendCommand(command) {
  return (dispatch) => {

    dispatch(receiveCommand(command))

    connect().then((socket) => {
      //socket.send('open /dev/tty.usbmodem1411 9600\n')
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        console.log('event', data)

        if (data.Cmd) {

        }
      //socket.send('send /dev/cu.usbmodem1411 G0 X5 Y2 F100\n')

        //if (data.SerialPorts && data.SerialPorts.length) {
          //console.log('found devices', data.SerialPorts)
          //dispatch(receiveDevices(data.SerialPorts))
        //}
      }
    })

  }
}

/**
 * Handle sending a gcode command to the device.
 *
 * @param {String} command
 */
export function receiveCommand(command) {
  return {
    type: SEND_COMMAND,
    command,
  }
}
