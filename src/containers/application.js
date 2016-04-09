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
      connected: false,
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
      status: 'idle',
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
    this.setState({ connected: true })
  },

  _onDisconnect() {
    this.setState({ connected: false })
  },

  _onAvailablePorts(ports) {
    const devices = ports.map((port) => {
      return {
        location: 'asdf',
        name: port.comName,
        open: false,
      }
    })
    this.setState({ devices })
  },

  _onResponse(msg) {
    this.state.commands.push(msg)
    this.setState({ commands: this.state.commands })
  },

  _sendCommand(cmd) {
    this.state.commands.push(cmd)
    this.setState({ commands: this.state.commands })
    this.socket.emit('send command', cmd)
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
    reader.readAsDataURL(file)
  },

  _fetchDevices() {
    console.log('fetch devices')
  },

  _connectToDevice(port) {
    this.socket.emit('connect to device', port)
  },

  _removeFile(index) {
    this.state.files.splice(index, 1)
    this.setState(this.state)
  },

  _dismissNotification(index) {
    this.state.notifications.splice(index, 1)
    this.setState(this.state)
  },

  _pause() {
    console.log('pause')
    this.setState({ status: 'hold' })
  },

  _play() {
    console.log('play')
    this.setState({ status: 'run' })
  },

  _stop() {
    console.log('stop')
    this.setState({ status: 'idle' })
  },

  _homeAll() {
    console.log('homeAll')
    this.setState({ x: 0, y: 0 })
  },

  _homeX() {
    console.log('homeX')
    this.setState({ x: 0 })
  },

  _homeY() {
    console.log('homeY')
    this.setState({ y: 0 })
  },

  _jogXNegative() {
    console.log('jogXNegative')
    this.setState({ x: this.state.x - this.state.jogDistance })
  },

  _jogXPositive() {
    console.log('jogXPositive')
    this.setState({ x: this.state.x + this.state.jogDistance })
  },

  _jogYNegative() {
    console.log('jogYNegative')
    this.setState({ y: this.state.y - this.state.jogDistance })
  },

  _jogYPositive() {
    console.log('jogYPositive')
    this.setState({ y: this.state.y + this.state.jogDistance })
  },

  render() {
    const {
      commands,
      devices,
      files,
      logs,
      notifications,
      status,
      supportedFileExtensions,
      x,
      y,
      z,
    } = this.state

    return (
      <div>
        <Navigation
          dismissNotification={this._dismissNotification}
          notifications={notifications}
        />
        <div className='page'>
          <div className='file-panel'>
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
              removeFile={this._removeFile}
            />
          </div>
          <div className='preview-pane'>
            <h5>Preview</h5>
            <Preview />
            <h5 className='m-t-2'>Commands</h5>
            <Console
              commands={commands}
              sendCommand={this._sendCommand}
            />
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
              />
            </div>
            <div className='m-b-2'>
              <MachineCoordinates
                displayUnits='mm'
                homeX={this._homeX}
                homeY={this._homeY}
                x={x}
                y={y}
              />
            </div>
            <h5 className='m-t-3'>Devices</h5>
            <Devices
              connectToDevice={this._connectToDevice}
              devices={devices}
              fetchDevices={this._fetchDevices}
            />
          </div>
        </div>
      </div>
    )
  },

})
