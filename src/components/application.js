import Console from './console'
import Devices from './devices'
import io from 'socket.io-client'
import React from 'react'

/**
 * keyboard shortcuts:
 * - left/right=x
 * - up/down=y
 * - page up/down=z
 * - spacebar=feedhold
 * - esc=stop
 */

const socket = new WebSocket('ws://localhost:8989/ws')

export default React.createClass({

  name: 'Application',

  getInitialState() {
    return {
      commands: [],
      ports: [],
    }
  },

  componentWillMount() {
    socket.onopen = (e) => {
      socket.send('list', (data) => {
        console.log('data', data)
      })

      console.log('connection established with serial-port-json-server')

      socket.onmessage = this._handleMessage
    }
  },

  _handleMessage(event) {
    try {
      const data = JSON.parse(event.data)
      console.log('event', data)

      if (data.SerialPorts && data.SerialPorts.length) {
        console.log('found ports', data.SerialPorts)
        this.setState({ ports: data.SerialPorts })
      }
    } catch(err) {
      if (err.name === 'SyntaxError') {
        console.log('websocket event returned invalid JSON')
      } else {
        throw err
      }
    }
  },

  render() {
    return (
      <div className='container'>
        <Console commands={this.state.commands} />
        <Devices ports={this.state.ports} />
      </div>
    )
  },
})
