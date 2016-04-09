import Console from '../components/console'
import Devices from '../components/devices'
import FileInput from '../components/file-input'
import FileList from '../components/file-list'
import JoggingControl from '../components/jogging-control'
import io from 'socket.io-client'
import MachineCoordinates from '../components/machine-coordinates'
import Navigation from '../components/navigation'
import PlayPauseButton from '../components/play-pause-button'
import Preview from '../components/preview'
import React, { PropTypes } from 'react'

export default React.createClass({

  name: 'Application',

  getInitialState() {
    return {
      connectedDevice: null,
      connectedToWebsockets: false,
      commands: [],
      devices: [],
      files: [],
      jogDistance: 1,
      logs: [],
      notifications: [
        {
          message: 'Here is a notification...',
        },
      ],
      shortcutsEnabled: true,
      startupBlocks: [
        //'G91', // set relative coordinate system
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
      x: 10.25,
      y: 36.732,
    }
  },

  componentWillMount() {
    this.socket = io('http://localhost:3000')
    this.socket.on('connect', this._onConnect)
    this.socket.on('disconnect', this._onDisconnect)
    this.socket.on('response', this._onResponse)
    this.socket.on('available ports', this._onAvailablePorts)
  },

  _onConnect() {
    console.log('onConnect')
    this.setState({ connectedToWebsockets: true })
  },

  _onDisconnect() {
    console.log('onDisconnect')
    this.setState({ connectedToWebsockets: false })
  },

  _onAvailablePorts(ports) {
    console.log('onAvailablePorts', ports)
    const devices = ports.map((port) => {
      return {
        name: port.comName,
        open: false,
      }
    })
    this.setState({ devices })
  },

  _onResponse(msg) {
    console.log('onResponse', msg)

    if (!msg) {
      console.log('empty message')
      return
    }

    // Strip "ok" messages if configured
    if (this.state.stripOkStatusMessages && msg === 'ok') {
      return
    }

    // Send startup block commands
    const startupBlocks = this.state.startupBlocks
    if (startupBlocks.length && msg.startsWith('Grbl')) {
      console.log('sending startup blocks', startupBlocks)
      startupBlocks.forEach((block) => {
        this._sendCommand(block)
      })
    }

    this._logCommand('system', msg)
  },

  _sendCommand(cmd, cb) {
    console.log('send command', cmd)
    this.socket.emit('send command', cmd, (err) => {
      if (err) {
        cb && cb(new Error('error sending command: ' + err))
        return
      }
      this._logCommand('user', cmd)
      cb && cb()
    })
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
    this.socket.emit('connect to device', name, (err) => {
      console.log('connected to device', name)
      let connectedDevice
      const devices = this.state.devices.map((device) => {
        if (device.name === name) {
          connectedDevice = device
          device.open = true
        }
        return device
      })

      this.setState({
        connectedDevice,
        devices,
      })
    })
  },

  _disconnectFromDevice(name) {
    this.socket.emit('disconnect from device', () => {
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
    for (let line of lines) {
      await new Promise((resolve, reject) => {
        this._sendCommand(line, (err) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
      })
    }
  },

  _dismissNotification(index) {
    this.state.notifications.splice(index, 1)
    this.setState(this.state)
  },

  _pause() {
    console.log('pause')
    this.setState({ status: 'hold' })
    this._sendCommand('! ; feed hold', (err) => {
      console.log('play received')
    })
  },

  _play() {
    console.log('play')
    this.setState({ status: 'run' })
    this._sendCommand('~ ; cycle start', (err) => {
      console.log('play received')
    })
  },

  _homeAll() {
    console.log('homeAll')
    // $H if home switches are enabled, otherwise 'G91 G0 X0 Y0 Z0'
    this._sendCommand('G90 G0 X0 Y0 Z0', (err) => {
      if (err) {
        throw err
      }

      console.log('homing success')
      this.setState({ x: 0, y: 0 })
    })
  },

  _homeX() {
    console.log('homeX')
    this._sendCommand('G90 G0 X0', (err) => {
      if (err) {
        throw err
      }

      console.log('homeX success')
      this.setState({ x: 0 })
    })
  },

  _homeY() {
    console.log('homeY')
    this._sendCommand('G90 G0 Y0', (err) => {
      if (err) {
        throw err
      }

      console.log('homeY success')
      this.setState({ y: 0 })
    })
  },

  _jogXNegative() {
    console.log('jogXNegative')
    this._sendCommand(`G91 G0 X-${this.state.jogDistance}`, (err) => {
      if (err) {
        throw err
      }

      console.log('jogXNegative success')
      this.setState({ x: this.state.x - this.state.jogDistance })
    })
  },

  _jogXPositive() {
    console.log('jogXPositive')
    this._sendCommand(`G91 G0 X${this.state.jogDistance}`, (err) => {
      if (err) {
        throw err
      }

      console.log('jogXPositive success')
      this.setState({ x: this.state.x + this.state.jogDistance })
    })
  },

  _jogYNegative() {
    console.log('jogYNegative')
    this._sendCommand(`G91 G0 Y-${this.state.jogDistance}`, (err) => {
      if (err) {
        throw err
      }

      console.log('jogYNegative success')
      this.setState({ y: this.state.y - this.state.jogDistance })
    })
  },

  _jogYPositive() {
    console.log('jogYPositive')
    this._sendCommand(`G91 G0 Y${this.state.jogDistance}`, (err) => {
      if (err) {
        throw err
      }

      console.log('jogYPositive success')
      this.setState({ y: this.state.y + this.state.jogDistance })
    })
  },

  _zeroX() {
    console.log('zeroX')
    this.setState({ x: 0 })
    this._sendCommand('G92 X0')
  },

  _zeroY() {
    console.log('zeroY')
    this.setState({ y: 0 })
    this._sendCommand('G92 Y0')
  },

  render() {
    const {
      commands,
      connectedDevice,
      connectedToWebsockets,
      devices,
      files,
      logs,
      notifications,
      shortcutsEnabled,
      status,
      supportedFileExtensions,
      x,
      y,
      z,
    } = this.state

    return (
      <div className='app-container'>
        <Navigation
          connectedDevice={connectedDevice}
          connectedToWebsockets={connectedToWebsockets}
          disconnectFromDevice={this._disconnectFromDevice}
          dismissNotification={this._dismissNotification}
          notifications={notifications}
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
            {
              connectedDevice ?
                <div>
                  <h4>Preview</h4>
                  <Preview />
                  <h4 className='m-t-2'>Commands</h4>
                  <Console
                    commands={commands}
                    sendCommand={this._sendCommand}
                  />
                </div> :
                <div>
                  <h3>Devices</h3>
                  <Devices
                    connectToDevice={this._connectToDevice}
                    devices={devices}
                    disconnectFromDevice={this._disconnectFromDevice}
                    fetchDevices={this._fetchDevices}
                  />
                </div>
            }
          </div>
          <div className='control-panel'>
            <div className='m-b-2'>
              <PlayPauseButton
                pause={this._pause}
                play={this._play}
                status={status}
                stop={this._stop}
              />
            </div>
            <div className='m-b-2'>
              <JoggingControl
                homeAll={this._homeAll}
                jogXNegative={this._jogXNegative}
                jogXPositive={this._jogXPositive}
                jogYNegative={this._jogYNegative}
                jogYPositive={this._jogYPositive}
                shortcutsEnabled={shortcutsEnabled}
              />
            </div>
            <div className='m-b-2'>
              <MachineCoordinates
                displayUnits='mm'
                homeX={this._homeX}
                homeY={this._homeY}
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
