import commands from './commands'
import devices from './devices'
import { combineReducers } from 'redux'

export default combineReducers({
  commands,
  devices,
})
