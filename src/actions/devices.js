export const ADD_DEVICE = 'ADD_DEVICE'

/**
 * Add a serial device to the list of available devices.
 *
 * The device is a "SerialPort" object returned from
 * serial-port-json-server WebSocket API.
 *
 * @param {Object} device
 */
export function addDevice(device) {
  return {
    type: ADD_DEVICE,
    name: device.Friendly,
  }
}
