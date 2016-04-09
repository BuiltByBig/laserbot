import Console from './console'
import Devices from './devices'
import GrblSettings from './grbl-settings'
import Preview from '../components/preview'
import React, { PropTypes } from 'react'

export default React.createClass({

  name: 'PreviewPane',

  propTypes: {
    connectToDevice: PropTypes.func.isRequired,
    connectedToDevice: PropTypes.bool.isRequired,
    commands: PropTypes.array.isRequired,
    devices: PropTypes.array.isRequired,
    disconnectFromDevice: PropTypes.func.isRequired,
    hideSettings: PropTypes.func.isRequired,
    machineConfig: PropTypes.object.isRequired,
    sendCommand: PropTypes.func.isRequired,
    settingsVisible: PropTypes.bool.isRequired,
    updateConfig: PropTypes.func.isRequired,
  },

  render() {

    const {
      connectToDevice,
      connectedToDevice,
      commands,
      devices,
      disconnectFromDevice,
      fetchDevices,
      hideSettings,
      machineConfig,
      sendCommand,
      settingsVisible,
      updateConfig,
    } = this.props

    if (!connectToDevice) {
      return (
        <div>
          <h3>Devices</h3>
          <Devices
            connectToDevice={connectToDevice}
            devices={devices}
            disconnectFromDevice={disconnectFromDevice}
            fetchDevices={fetchDevices}
          />
        </div>
      )
    }

    if (settingsVisible) {
      return (
        <div>
          <h4>Grbl Settings</h4>
          <GrblSettings
            config={machineConfig}
            hideSettings={hideSettings}
            updateConfig={updateConfig}
          />
        </div>
      )
    }

    return (
      <div>
        <h4>Preview</h4>
        <Preview />
        <h4 className='m-t-2'>Commands</h4>
        <Console
          commands={commands}
          sendCommand={sendCommand}
        />
      </div>
    )
  },

})

