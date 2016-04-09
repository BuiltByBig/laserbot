import Control from '../components/control'
import Console from '../components/console'
import Devices from '../components/devices'
import JogControls from '../components/jog-controls'
import JogDistanceSelector from '../components/jog-distance-selector'
import UnitSelector from '../components/unit-selector'
import MachineCoordinates from '../components/machine-coordinates'
import Device from '../typedefs'
import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { sendCommand } from '../actions/commands'
import { fetchDevices } from '../actions/devices'

//const socket = new WebSocket('ws://localhost:8989/ws')

const Application =  React.createClass({

  name: 'Application',

  propTypes: {
    commands: PropTypes.array,
    devices: PropTypes.shape({
      isFetching: PropTypes.boolean,
      didInvalidate: PropTypes.boolean,
      lastUpdated: PropTypes.instanceOf(Date),
      item: PropTypes.arrayOf(Device),
    }),
    fetchDevices: PropTypes.func.isRequired,
    sendCommand: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      stepDistance: 1.0,
      displayUnits: 'mm',
      x: 0,
      y: 0,
      z: 0,
    }
  },

  changeUnits(displayUnits) {
    this.setState({ displayUnits })
  },

  homeX() {
    this.setState({ x: 0 })
  },

  homeY() {
    this.setState({ y: 0 })
  },

  homeZ() {
    this.setState({ z: 0 })
  },

  goHome() {
    this.setState({ x: 0, y: 0, z: 0 })
  },

  setStepDistance(distance) {
    this.setState({ stepDistance: distance })
  },

  stepX(distance) {
    this.setState({ x: this.state.x + distance })
  },

  stepY(distance) {
    this.setState({ y: this.state.y + distance })
  },

  stepZ(distance) {
    this.setState({ z: this.state.z + distance })
  },

  generateDisplayUnit(value) {
    if (this.state.displayUnits === 'in') {
      return value / 25.4
    }

    return value
  },

  render() {
    const { commands, devices, fetchDevice, sendCommand } = this.props
    const { stepDistance, displayUnits, x, y, z } = this.state
    const displayX = this.generateDisplayUnit(x)
    const displayY = this.generateDisplayUnit(y)
    const displayZ = this.generateDisplayUnit(z)

    return (
      <div>
        <div className='navbar navbar-light bg-faded m-b-3'>
          <a href='/' className='navbar-brand'>CNC</a>
        </div>

        <div className='container'>
          <div className='row m-b-3'>
            <div className='col-sm-7'>
              <JogControls
                goHome={this.goHome}
                stepDistance={this.generateDisplayUnit(stepDistance)}
                stepX={this.stepX}
                stepY={this.stepY}
                stepZ={this.stepZ}
              />
            </div>
            <div className='col-sm-5'>
              <MachineCoordinates
                homeX={this.homeX}
                homeY={this.homeY}
                homeZ={this.homeZ}
                displayUnits={displayUnits}
                x={displayX}
                y={displayY}
                z={displayZ}
              />
              <div className='m-t-1'>
                <JogDistanceSelector
                  setStepDistance={this.setStepDistance}
                  stepDistance={this.generateDisplayUnit(stepDistance)}
                  displayUnits={displayUnits}
                />
              </div>
              <div className='m-t-1'>
                <UnitSelector
                  changeUnits={this.changeUnits}
                  displayUnits={displayUnits}
                />
              </div>
            </div>
          </div>
          <Control
            sendCommand={sendCommand}
          />
          <Console
            commands={commands}
            sendCommand={sendCommand}
          />
          <Devices
            didInvalidate={devices.didInvalidate}
            fetchDevices={fetchDevices}
            isFetching={devices.isFetching}
            items={devices.items}
            lastUpdated={devices.lastUpdated}
          />
        </div>
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

export default connect(select, { fetchDevices, sendCommand })(Application)
