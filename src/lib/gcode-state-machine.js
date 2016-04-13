import parser from './parse-gcode'

/**
 * TODO: make immutable?
 *
 * http://www.nist.gov/customcf/get_pdf.cfm?pub_id=823374
 */

export default () => {

  let state = {
    distanceMode: 'relative', // or 'absolute'
    history: [],
    spindleEnabled: false,
    spindleSpeed: null,
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
      const letter = word[0]
      const argument = word[1]

      switch (letter) {
        case 'G':
          // Handle spindle on/off
          if (argument === 90) {
            state.distanceMode = 'absolute'
          } else if (argument === 91) {
            state.distanceMode = 'relative'
          }
          break
        case 'M':
          // Handle spindle on/off
          if (argument === 3 || argument === 5) {
            state.spindleEnabled = argument === 3
          }
          break
        case 'S':
          state.spindleSpeed = argument
          break
        case 'X':
          if (state.distanceMode === 'relative') {
            state.x += argument
          } else {
            state.x = argument
          }
          break
        case 'Y':
          if (state.distanceMode === 'relative') {
            state.y += argument
          } else {
            state.y = argument
          }
          break
        case 'Z':
          if (state.distanceMode === 'relative') {
            state.z += argument
          } else {
            state.z = argument
          }
          break
        default:
      }
    })

    return state
  }
}
