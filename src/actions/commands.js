export const SEND_COMMAND = 'SEND_COMMAND'

/**
 * Handle sending a gcode command to the device.
 *
 * @param {String} command
 */
export function sendCommand(command) {
  return {
    type: SEND_COMMAND,
    command,
  }
}
