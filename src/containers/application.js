import FileInput from '../components/file-input'
import FileList from '../components/file-list'
import JoggingControl from '../components/jogging-control'
import io from 'socket.io-client'
import MachineCoordinates from '../components/machine-coordinates'
import Navigation from '../components/navigation'
import parser from '~/lib/parse-gcode'
import PlayPauseButton from '../components/play-pause-button'
import PreviewPane from '../components/preview-pane'
import React, { PropTypes } from 'react'

const MOCK_DEVICE_NAME = 'Mock grbl machine'

export default React.createClass({

  name: 'Application',

  getInitialState() {
    return {
      connectedDevice: null,
      connectedToWebsockets: false,
      commands: [],
      devices: [],
      //enableZ: false, // TODO: allow showing Z if desired
      files: [],
      grblConfig: {
        '$100': 250,
        '$101': 250,
        '$110': 500,
        '$111': 500,
      },
      jogDistance: 1,
      notifications: [
        {
          message: 'Here is a notification...',
          type: 'danger',
        },
      ],
      settingsVisible: false,
      shortcutsEnabled: true,
      showMocKDevice: true,
      startupBlocks: [
        //'$$ ; get grbl settings', // set relative coordinate system
      ],
      status: 'idle',
      stripOkStatusMessages: true,
      supportedFileExtensions: [
        '.gcode',
        '.gif',
        '.jpg',
        '.nc',
        '.png',
        '.svg',
        '.txt',
      ],
      x: 0,
      y: 0,
    }
  },

  componentWillMount() {
    this.socket = io('http://localhost:3000')
    this.socket.on('connect', this._onConnect)
    this.socket.on('disconnect', this._onDisconnect)
    this.socket.on('response', this._onResponse)
    this.socket.on('serial connect', this._onSerialConnect)
    this.socket.on('serial disconnect', this._onSerialDisconnect)
    this.socket.on('serial error', this._onSerialError)
    this.socket.on('available devices', this._onAvailableDevices)
  },

  _emit(msg, data, cb) {

    // Dont emit events when connected to the mock device.
    const connDevice = this.state.connectedDevice
    const mockName = MOCK_DEVICE_NAME
    if ((msg === 'connect to device' && data === mockName) ||
        (connDevice && connDevice.name === mockName)) {
      return cb(null, null)
    }

    this.socket.emit(msg, data, cb)
  },

  _onConnect() {
    console.log('onConnect')
    this.setState({ connectedToWebsockets: true })
  },

  _onDisconnect() {
    console.log('onDisconnect')
    this.setState({ connectedToWebsockets: false })
  },

  _onAvailableDevices(availableDevices) {
    console.log('onAvailableDevices', availableDevices)
    const devices = availableDevices.map((device) => {
      return {
        name: device.comName,
        open: false,
      }
    })

    if (this.state.showMocKDevice) {
      devices.push({
        name: MOCK_DEVICE_NAME,
        open: false,
      })
    }

    this.setState({ devices })
  },

  _onSerialConnect() {
    console.log('serial connect')
    this.setState({
      connectedToDevice: true,
    })

    this._updateMachineConfig()
  },

  _onSerialDisconnect() {
    console.log('serial disconnect')
    this.state.connectedDevice.open = false
    this.setState({
      connectedToDevice: false,
      connectedDevice: null,
    })
  },

  _onSerialError(err) {
    console.log('serial error', err)
    this.state.notifications.push({
      type: 'error',
      message: err,
    })
    this.setState(this.state)
  },

  _updateMachineConfig() {
    this._emit('get config', null, (err, config) => {
      console.log('config', config)
    })
  },

  async _onResponse(msg) {
    console.log('onResponse', msg)

    if (!msg) {
      console.log('empty message')
      return
    }

    if (msg.includes('[Reset to continue]')) {
      this.setState({ status: 'error' })
    }

    // Strip "ok" messages if configured
    if (this.state.stripOkStatusMessages && msg === 'ok') {
      return
    }

    // Send startup block commands
    const startupBlocks = this.state.startupBlocks
    if (startupBlocks.length && msg.startsWith('Grbl')) {
      console.log('sending startup blocks', startupBlocks)
      await this._sendCommands(startupBlocks)
    }

    this._logCommand('system', msg)
  },

  _parseCommand(cmd) {
    console.log('parsing command', cmd)
    console.log(parser(cmd))
    //gcode.parseString(cmd, (err, result) => {
      //console.log('result', JSON.stringify(result));
    //})
  },

  // Promisify? could prevent buffer overflow/blocking...
  _sendCommand(cmd, cb) {
    console.log('send command', cmd)

    this._emit('send command', cmd, (err, data) => {
      if (err) {
        console.error(`error sending command ${cmd}:`, err)
        cb && cb(new Error(`error sending command ${cmd}: ${err.message}`), null)
        return
      }
      this._logCommand('user', cmd)
      cb && cb(null, data)
    })
  },

  async _sendCommands(cmds) {
    console.log('send commands:', cmds)
    for (let cmd of cmds) {

      // Skip empty commands.
      if (!cmd) {
        continue
      }

      this._parseCommand(cmd)

      console.log('cmd', cmd)
      await new Promise((resolve, reject) => {
        this._sendCommand(cmd, (err, data) => {
          if (err) {
            return reject(err)
          }
          resolve(data)
        })
      })
    }
  },

  _logCommand(type, content) {
    // TODO: show what commands have been received or are pending
    this.state.commands.push({
      content,
      type,
    })
    this.setState({
      commands: this.state.commands,
    })
  },

  _handleFileUpload(event) {
    const file = event.target.files[0]
    console.log('selected file:', file)
    console.log('name', file.name)
    console.log('last modified', file.lastModifiedDate)
    console.log('size', file.size)

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      this.state.files.push({
        content,
        name: file.name,
        lastModified: file.lastModifiedDate,
        size: file.size,
      })
      this.setState(this.state)
    }

    reader.onloadend = () => {
      console.log('end')
    }
    reader.readAsText(file)
  },

  _fetchDevices() {
    console.log('fetch devices')
  },

  _connectToDevice(name) {
    this._emit('connect to device', name, (err) => {
      console.log('connected to device', name)
      let connectedDevice
      const devices = this.state.devices.map((device) => {
        if (device.name === name) {
          connectedDevice = device
          device.open = true
        }
        return device
      })

      // TODO: get grbl settings on connect and set

      this.setState({
        connectedDevice,
        devices,
      })
    })
  },

  _disconnectFromDevice(name) {
    this._emit('disconnect from device', null, (err) => {
      const devices = this.state.devices.map((device) => {
        if (device.name === name) {
          device.open = false
        }
        return device
      })

      this.setState({
        connectedDevice: null,
        commands: [],
        devices,
      })
    })
  },

  _removeFile(index) {
    this.state.files.splice(index, 1)
    this.setState(this.state)
  },

  async _loadFile(index) {
    const file = this.state.files[index]
    console.log('load file', index)
    console.log(file)
    const lines = file.content.split('\n')

    this.setState({ status: 'run' })

    // Run serially so the buffer doesn't overflow on
    // grbl
    await this._sendCommands(lines)

    this.setState({ status: 'idle' })
  },

  _dismissNotification(index) {
    this.state.notifications.splice(index, 1)
    this.setState(this.state)
  },

  async _killAlarm() {
    console.log('killAlarm')
    this.setState({ status: 'idle' })
    await this._sendCommands([ '$X ; kill alarm' ])
    console.log('killAlarm received')
  },

  async _pause() {
    console.log('pause')
    this.setState({ status: 'hold' })
    await this._sendCommands([ '! ; feed hold' ])
    console.log('pause received')
  },

  async _play() {
    console.log('play')
    this.setState({ status: 'run' })
    await this._sendCommands([ '~ ; cycle start' ])
    console.log('play success')
  },

  async _stop() {
    console.log('stop')
    this.setState({ status: 'idle' })
    await this._sendCommands([ 'M2 ~ ; stop machine and reset hold' ])
    console.log('stop success')
  },

  async _homeAll() {
    console.log('homeAll')
    // $H if home switches are enabled, otherwise 'G91 G0 X0 Y0 Z0'
    await this._sendCommands([ 'G90 G0 X0 Y0 Z0' ])
    console.log('homeAll success')
    this.setState({ x: 0, y: 0 })
  },

  async _homeX() {
    console.log('homeX')
    await this._sendCommands([ 'G90 G0 X0' ])
    console.log('homeX success')
    this.setState({ x: 0 })
  },

  async _homeY() {
    console.log('homeY')
    await this._sendCommands([ 'G90 G0 Y0' ])
    console.log('homeY success')
    this.setState({ y: 0 })
  },

  async _jogXNegative() {
    console.log('jogXNegative')
    await this._sendCommands([ `G91 G0 X-${this.state.jogDistance}` ])
    console.log('jogXNegative success')
    this.setState({ x: this.state.x - this.state.jogDistance })
  },

  async _jogXPositive() {
    console.log('jogXPositive')
    await this._sendCommands([ `G91 G0 X${this.state.jogDistance}` ])
    console.log('jogXPositive success')
    this.setState({ x: this.state.x + this.state.jogDistance })
  },

  async _jogYNegative() {
    console.log('jogYNegative')
    await this._sendCommands([ `G91 G0 Y-${this.state.jogDistance}` ])
    console.log('jogYNegative success')
    this.setState({ y: this.state.y - this.state.jogDistance })
  },

  async _jogYPositive() {
    console.log('jogYPositive')
    await this._sendCommands([ `G91 G0 Y${this.state.jogDistance}` ])
    console.log('jogYPositive success')
    this.setState({ y: this.state.y + this.state.jogDistance })
  },

  async _zeroX() {
    console.log('zeroX')
    this.setState({ x: 0 })
    await this._sendCommands([ 'G92 X0' ])
  },

  async _zeroY() {
    console.log('zeroY')
    this.setState({ y: 0 })
    await this._sendCommands([ 'G92 Y0' ])
  },

  async _updateConfig(config) {
    const cmds = _.map(config, (val, key) => `${key}=${Number(val)}`)
    await this._sendCommands(cmds)
    this.setState({ grblConfig: config })
  },

  _hideSettings() {
    this.setState({ settingsVisible: false })
  },

  _showSettings() {
    this.setState({ settingsVisible: true })
  },

  render() {
    const {
      commands,
      connectedDevice,
      connectedToWebsockets,
      devices,
      files,
      grblConfig,
      notifications,
      shortcutsEnabled,
      settingsVisible,
      status,
      supportedFileExtensions,
      x,
      y,
      z,
    } = this.state

    const connectedToDevice = Boolean(connectedDevice)

    return (
      <div className='app-container'>
        <Navigation
          connectedDevice={connectedDevice}
          connectedToWebsockets={connectedToWebsockets}
          disconnectFromDevice={this._disconnectFromDevice}
          dismissNotification={this._dismissNotification}
          hideSettings={this._hideSettings}
          notifications={notifications}
          showSettings={this._showSettings}
          settingsVisible={settingsVisible}
        />
        <div className='page'>
          <div className='file-panel bg-inverse'>
            <FileInput
              accept={supportedFileExtensions.join(',')}
              className='file-button btn btn-primary btn-block btn-lg'
              iconName='folder-open-o'
              name='gcode'
              label='Upload File'
              onChange={this._handleFileUpload}
            />
            <p className='file-upload-note text-muted m-t-1'>
              <small>Supports {supportedFileExtensions.join(', ')}</small>
            </p>
            <FileList
              files={files}
              loadFile={this._loadFile}
              removeFile={this._removeFile}
            />
          </div>
          <div className='preview-pane'>
            <PreviewPane
              connectToDevice={this._connectToDevice}
              connectedToDevice={connectedToDevice}
              commands={commands}
              devices={devices}
              disconnectFromDevice={this._disconnectFromDevice}
              hideSettings={this._hideSettings}
              fetchDevices={this._fetchDevices}
              machineConfig={grblConfig}
              sendCommands={this._sendCommands}
              settingsVisible={settingsVisible}
              updateConfig={this._updateConfig}
            />
          </div>
          <div className='control-panel'>
            <div className='m-b-2'>
              <PlayPauseButton
                connectedToDevice={connectedToDevice}
                killAlarm={this._killAlarm}
                pause={this._pause}
                play={this._play}
                status={status}
                stop={this._stop}
              />
            </div>
            <div className='m-b-2'>
              <JoggingControl
                connectedToDevice={connectedToDevice}
                homeAll={this._homeAll}
                jogXNegative={this._jogXNegative}
                jogXPositive={this._jogXPositive}
                jogYNegative={this._jogYNegative}
                jogYPositive={this._jogYPositive}
                shortcutsEnabled={shortcutsEnabled}
                status={status}
              />
            </div>
            <div className='m-b-2'>
              <MachineCoordinates
                connectedToDevice={connectedToDevice}
                displayUnits='mm'
                homeX={this._homeX}
                homeY={this._homeY}
                status={status}
                x={x}
                y={y}
                zeroX={this._zeroX}
                zeroY={this._zeroY}
              />
            </div>
          </div>
        </div>
      </div>
    )
  },

})
