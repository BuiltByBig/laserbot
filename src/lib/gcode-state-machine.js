import parser from './parse-gcode'

/**
 * TODO: make immutable?
 *
 * http://www.nist.gov/customcf/get_pdf.cfm?pub_id=823374
 */

export default () => {

  let state = {
    coolant: false, // or 'mist' or 'flood'
    distanceMode: 'relative', // or 'absolute'
    history: [],
    spindleDirection: 'clockwise', // or 'counter'
    spindleEnabled: false,
    spindleSpeed: null,
    stopped: false,
    units: 'mm', // or 'in'
    x: 0,
    y: 0,
    z: 0,
  }

  return (command, customState) => {

    // Accept a custom intial state object in case
    // the users wants a default based on external changes.
    if (customState) {
      state = Object.assign({}, state, customState)
    }

    // Add the command to the history.
    state.history.push(command)

    const parsed = parser(command)

    // Parse each word and update the state accordingly
    parsed.words.forEach((word) => {
      const [ letter, arg ] = word

      switch (letter) {
        case 'G':
          if (arg === 90) {
            state.distanceMode = 'absolute'
          } else if (arg === 91) {
            state.distanceMode = 'relative'
          } else if (arg === 20) {
            state.units = 'mm'
          } else if (arg === 21) {
            state.units = 'in'
          }
          break
        case 'M':
          // Handle spindle on/off
          if (arg === 0) {
            state.stopped = true
          } else if (arg === 3 || arg === 4) {
            state.spindleEnabled = true
            state.spindleDirection = arg === 3 ? 'clockwise' : 'counter'
          } else if (arg === 5) {
            state.spindleEnabled = false
          } else if (arg === 7) {
            state.coolant = 'mist'
          } else if (arg === 8) {
            state.coolant = 'flood'
          } else if (arg === 9) {
            state.coolant = false
          }
          break
        case 'S':
          state.spindleSpeed = arg
          break
        case 'X':
          if (state.distanceMode === 'relative') {
            state.x += arg
          } else {
            state.x = arg
          }
          break
        case 'Y':
          if (state.distanceMode === 'relative') {
            state.y += arg
          } else {
            state.y = arg
          }
          break
        case 'Z':
          if (state.distanceMode === 'relative') {
            state.z += arg
          } else {
            state.z = arg
          }
          break
        default:
      }
    })

    return state
  }
}
