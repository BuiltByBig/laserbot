import Application from './containers/application'
import logger from 'redux-logger'
import React from 'react'
import reducers from './reducers'
import thunk from 'redux-thunk'
import {fetchDevices } from './actions/devices'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import './styles/index.scss'

const middleware = process.env.NODE_ENV === 'production' ?
  [ thunk ] :
  [ thunk, logger() ]

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore)
const store = createStoreWithMiddleware(reducers)
const root = document.getElementById('app')

store.dispatch(fetchDevices())

render(
  <Provider store={store}>
    <Application />
  </Provider>,
  root
)
