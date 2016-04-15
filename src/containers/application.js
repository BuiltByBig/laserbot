import FileInput from '~/components/file-input'
import FileList from '~/components/file-list'
import JoggingControl from '~/components/jogging-control'
import Immutable from 'immutable'
import io from 'socket.io-client'
import LaserStatus from '~/components/laser-status'
import MachineCoordinates from '~/components/machine-coordinates'
import Navigation from '~/components/navigation'
import parser from '~/lib/parse-gcode'
import PlayPauseButton from '~/components/play-pause-button'
import PreviewPane from '~/components/preview-pane'
import React, { PropTypes } from 'react'
import stateMachine from '~/lib/gcode-state-machine'
import queue from 'queue'

const MOCK_DEVICE_NAME = 'Mock grbl machine'

const Command = Immutable.Record({
  content: '',
  type: '',
})

export default React.createClass({

  name: 'Application',

  getInitialState() {
    return {
      config: {
        grbl: {
          '$100': 250,
          '$101': 250,
          '$110': 500,
          '$111': 500,
        },
      },
      connectedDevice: null,
      connectedToWebsockets: false,
      commands: Immutable.List(),
      devices: [],
      //enableZ: false, // TODO: allow showing Z if desired
      files: [],
      jogDistance: 1,
      machine: {
        laserEnabled: false,
        laserPower: null,
        x: 0,
        y: 0,
      },
      notifications: [
        //{
          //message: 'Here is a notification...',
          //type: 'danger',
        //},
      ],
      settingsVisible: false,
      shortcutsEnabled: true,
      showMocKDevice: true,
      startupBlocks: [
        //'$$  get grbl settings', // set relative coordinate system
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

    // Gcode state machine
    this.gcodeMachine = stateMachine()

    // Gcode queue
    this.q = queue()
    this.q.concurrency = 1

    //this.q.timeout = 1000
    //this.q.on('timeout', (next, job) => {
      //console.log('job timed out:', job.toString().replace(/\n/g, ''))
      //next()
    //})

    //this.q.on('success', (result, job) => {
      //console.log('job finished processing:', job.toString().replace(/\n/g, ''))
    //})
  },

  _emit(msg, data, cb) {

    // Dont emit events when connected to the mock device.
    const connDevice = this.state.connectedDevice
    const mockName = MOCK_DEVICE_NAME
    if ((msg === 'connect to device' && data === mockName) ||
        (connDevice && connDevice.name === mockName)) {
      const timeout = Math.floor(Math.random() * 100) + 10
      console.log('timeout', timeout)
      return setTimeout(cb, timeout)
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

  _onResponse(msg) {
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
      this._queueCommands(startupBlocks)
    }

    this._logCommand('system', msg)
  },

  _queueCommands(cmds) {

    console.log('queue commands', cmds)

    if (!this.state.connectedDevice) {
      console.log('no device, cannot send commands', cmds)
      return
    }

    for (let cmd of cmds) {

      console.log('send command', cmd)

      // Skip empty commands.
      if (!cmd) {
        continue
      }

      this.q.push(function (cb) {
        this._emit('send command', cmd, (err, data) => {

          if (err) {
            console.error(`error sending command ${cmd}:`, err)
            throw new Error(`error sending command ${cmd}: ${err.message}`)
          }

          console.log('command received', cmd)


          const {
            spindleEnabled,
            spindleSpeed,
            //stopped,
            //units,
            x,
            y,
          } = this.gcodeMachine(cmd)
          this.state.machine.laserEnabled = spindleEnabled
          this.state.machine.laserPower = spindleSpeed
          this.state.machine.x = x
          this.state.machine.y = y
          this.setState(this.state)

          this._logCommand('user', cmd)

          cb()
        })
      }.bind(this))


      console.log('command sent', cmd)
    }

    this.q.start((err) => {
      console.log('queue done!')
    })
  },

  _logCommand(type, content) {

    // TODO: show what commands have been received or are pending

    this.state.commands = this.state.commands.push(
      new Command({ type, content })
    )

    this.setState(this.state)
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

  _disconnectFromDevice() {
    const name = this.state.connectedDevice.name
    this._emit('disconnect from device', null, (err) => {
      const devices = this.state.devices.map((device) => {
        if (device.name === name) {
          device.open = false
        }
        return device
      })

      this.setState({
        connectedDevice: null,
        commands: Immutable.List(),
        devices,
      })
    })
  },

  _removeFile(index) {
    this.state.files.splice(index, 1)
    this.setState(this.state)
  },

  _loadFile(index) {
    console.log('load file', index)

    const file = this.state.files[index]

    console.log(file)

    const lines = file.content.split('\n')

    this.setState({ status: 'run' })

    // TODO Handle state more elegantly somehow

    // Run serially so the buffer doesn't overflow on
    // grbl
    this._queueCommands(lines)

    this.setState({ status: 'idle' })
  },

  _dismissNotification(index) {
    this.state.notifications.splice(index, 1)
    this.setState(this.state)
  },

  _killAlarm() {
    console.log('killAlarm')
    this.setState({ status: 'idle' })
    this._queueCommands([ '$X  kill alarm' ])
  },

  _pause() {
    console.log('pause')
    this.setState({ status: 'hold' })
    this._queueCommands([ '!  feed hold' ])
  },

  _play() {
    console.log('play')
    this.setState({ status: 'run' })
    this._queueCommands([ '~  cycle start' ])
  },

  _stop() {
    console.log('stop')
    this.setState({ status: 'idle' })
    this._queueCommands([ 'M2 ~  stop machine and reset hold' ])
  },

  _reset() {
    console.log('reset')
    this._queueCommands([ '\x18  reset machine' ])
    this._disconnectFromDevice()
  },

  _homeAll() {
    console.log('homeAll')
    // $H if home switches are enabled, otherwise 'G91 G0 X0 Y0 Z0'
    this._queueCommands([ 'G90 G0 X0 Y0 Z0' ])
  },

  _homeX() {
    console.log('homeX')
    this._queueCommands([ 'G90 G0 X0' ])
  },

  _homeY() {
    console.log('homeY')
    this._queueCommands([ 'G90 G0 Y0' ])
  },

  _jogXNegative() {
    console.log('jogXNegative')
    this._queueCommands([ `G91 G0 X-${this.state.jogDistance}` ])
  },

  _jogXPositive() {
    console.log('jogXPositive')
    this._queueCommands([ `G91 G0 X${this.state.jogDistance}` ])
  },

  _jogYNegative() {
    console.log('jogYNegative')
    this._queueCommands([ `G91 G0 Y-${this.state.jogDistance}` ])
    //this.setState({ y: this.state.y - this.state.jogDistance })
  },

  _jogYPositive() {
    console.log('jogYPositive')
    this._queueCommands([ `G91 G0 Y${this.state.jogDistance}` ])
    //this.setState({ y: this.state.y + this.state.jogDistance })
  },

  _zeroX() {
    console.log('zeroX')
    this._queueCommands([ 'G92 X0' ])
  },

  _enableLaser() {
    console.log('enableLaser')
    this._queueCommands([ 'M3' ])
  },

  _disableLaser() {
    console.log('disableLaser')
    this._queueCommands([ 'M5' ])
  },

  _zeroY() {
    console.log('zeroY')
    this._queueCommands([ 'G92 Y0' ])
  },

  _zeroY() {
    console.log('zeroY')
    this._queueCommands([ 'G92 Y0' ])
  },

  _updateConfig(config) {
    const cmds = _.map(config, (val, key) => `${key}=${Number(val)}`)
    this._queueCommands(cmds)
    console.log('config', this.state.config)
    this.state.config.grbl = config
    this.setState(this.state)
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
      config,
      machine,
      notifications,
      shortcutsEnabled,
      settingsVisible,
      status,
      supportedFileExtensions,
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
              machineConfig={config.grbl}
              sendCommands={this._queueCommands}
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
                reset={this._reset}
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
            <div className='m-b-3'>
              <MachineCoordinates
                connectedToDevice={connectedToDevice}
                displayUnits='mm'
                homeX={this._homeX}
                homeY={this._homeY}
                status={status}
                x={machine.x}
                y={machine.y}
                zeroX={this._zeroX}
                zeroY={this._zeroY}
              />
            </div>
            <div className='m-b-2'>
              <LaserStatus
                connectedToDevice={connectedToDevice}
                disableLaser={this._disableLaser}
                enabled={machine.laserEnabled}
                enableLaser={this._enableLaser}
                power={machine.laserPower}
                status={status}
              />
            </div>
          </div>
        </div>
      </div>
    )
  },

})
