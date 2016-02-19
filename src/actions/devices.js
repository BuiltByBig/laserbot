import io from 'socket.io-client'
import connect from '../lib/socket'

export const RECEIVE_DEVICES = 'RECEIVE_DEVICES'
export const REFRESH_DEVICES = 'REFRESH_DEVICES'

export function fetchDevices() {
  console.log('fetch devices')

  return (dispatch) => {
    dispatch(refreshDevices())

    connect().then((socket) => {
      socket.send('list')
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        console.log('event', data)

        if (data.SerialPorts && data.SerialPorts.length) {
          console.log('found devices', data.SerialPorts)
          dispatch(receiveDevices(data.SerialPorts))
        }
      }
    })
  }
}

/**
 * Store all received serial devices.
 *
 * A device is a "SerialPort" object returned from
 * serial-port-json-server WebSocket API.
 *
 * @param {Object} device
 */
export function receiveDevices(devices) {
  const items = devices.map((device) => {
    return {
      baud: device.Baud,
      location: device.Name,
      name: device.Friendly,
      open: device.IsOpen,
    }
  })

  return {
    didInvalidate: false,
    isFetching: false,
    items,
    lastUpdated: new Date(),
    type: RECEIVE_DEVICES,
  }
}

/**
 * Refresh the device list.
 */
export function refreshDevices() {
  console.log('refresh devices')
  return {
    type: REFRESH_DEVICES,
  }
}
