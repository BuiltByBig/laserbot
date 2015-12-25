import { SEND_COMMAND } from '../actions/commands'

function command(state, action) {
  switch (action.type) {
    case SEND_COMMAND:
      return {
        command: action.command,
      }
    default:
      return state
  }
}

function commands(state = [], action) {
  switch (action.type) {
    case SEND_COMMAND:
      return [
        ...state,
        command(undefined, action),
      ]
    default:
      return state
  }
}

export default commands
