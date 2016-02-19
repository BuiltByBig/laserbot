import { combineReducers } from 'redux'
import { RECEIVE_DEVICES, REFRESH_DEVICES } from '../actions/devices'

const inititalState = {
  isFetching: false,
  didInvalidate: false,
  items: [],
  lastUpdated: null,
}

function devices(state = inititalState, action) {
  switch (action.type) {
    case RECEIVE_DEVICES:
      return {
        ...state,
        didInvalidate: false,
        isFetching: false,
        items: action.items,
        lastUpdated: new Date(),
      }
    //case INVALIDATE_DEVICE_FETCH:
      //return {
        //...state,
        //didInvalidate: true,
        //isFetching: false,
      //}
    case REFRESH_DEVICES:
      return {
        ...state,
        didInvalidate: false,
        isFetching: true,
      }
    default:
      return state
  }
}

export default devices
