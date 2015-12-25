import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { sendCommand } from '../actions/commands'
import { addDevice } from '../actions/devices'
import Console from '../components/console'
import Devices from '../components/devices'
import io from 'socket.io-client'
import React from 'react'

/**
 * TODO:
 *
 * - Edit grbl shield settings
 *
 * Keyboard shortcuts:
 * - left/right=x
 * - up/down=y
 * - page up/down=z
 * - spacebar=feedhold
 * - esc=stop
 */

const socket = new WebSocket('ws://localhost:8989/ws')

const Application =  React.createClass({

  name: 'Application',

  propTypes: {
    commands: React.PropTypes.array,
    devices: React.PropTypes.array,
  },

  getDefaultProps() {
    return {
      commands: [],
      devices: [],
    }
  },

  componentWillMount() {
    const { dispatch } = this.props

    socket.onopen = (e) => {
      socket.send('list', (data) => {
        console.log('data', data)
      })

      console.log('connection established with serial-port-json-server')

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        console.log('event', data)

        if (data.SerialPorts && data.SerialPorts.length) {
          console.log('found devices', data.SerialPorts)
          data.SerialPorts.forEach((device) => {
            console.log('add device', device)
            dispatch(addDevice(device))
          })
        }
      }
    }
  },

  render() {
    const { dispatch } = this.props
    return (
      <div className='container'>
        <Console
          commands={this.props.commands}
          sendCommand={(command) => {
            dispatch(sendCommand(command))
          }}
        />
        <Devices
          devices={this.props.devices}
        />
      </div>
    )
  },
})


function select(state) {
  return {
    commands: state.commands,
    devices: state.devices,
  }
}

export default connect(select)(Application)
