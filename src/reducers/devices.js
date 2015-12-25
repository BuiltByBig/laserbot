import { combineReducers } from 'redux'
import { ADD_DEVICE } from '../actions/devices'

function device(state, action) {
  switch (action.type) {
    case ADD_DEVICE:
      return {
        name: action.name,
      }
    default:
      return state
  }
}

function devices(state = [], action) {
  switch (action.type) {
    case ADD_DEVICE:
      return [
        ...state,
        device(undefined, action),
      ]
    default:
      return state
  }
}

export default devices
