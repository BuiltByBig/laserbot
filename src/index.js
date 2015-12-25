import Application from './containers/application'
//import configureStore from './store/configure-store'
import React from 'react'
import reducers from './reducers'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import './styles/index.scss'

//const store = configureStore()
const store = createStore(reducers)
const root = document.getElementById('app')

render(
  <Provider store={store}>
    <Application />
  </Provider>,
  root
)
