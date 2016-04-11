import Card from './card'
import FA from 'react-fontawesome'
import key from 'keymaster'
import React, { PropTypes } from 'react'

export default React.createClass({

  name: 'Control',

  propTypes: {
    connectedToDevice: PropTypes.bool.isRequired,
    killAlarm: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
    play: PropTypes.func.isRequired,
    status: PropTypes.oneOf([
      'alarm',
      'check',
      'door',
      'error',
      'hold',
      'home',
      'idle',
      'run',
    ]).isRequired,
    stop: PropTypes.func.isRequired,
  },

  componentWillMount() {
    key('space', (e) => {
      e.preventDefault()
      const status = this.props.status
      if (status === 'hold' || status === 'idle') {
        this.props.play()
      } else if (status === 'run'){
        this.props.pause()
      }
    })
  },

  componentWillUnmount() {
    key.unbind('space')
  },

  render() {
    const {
      connectedToDevice,
      killAlarm,
      pause,
      play,
      status,
      stop,
    } = this.props

    let action = play
    let className = 'btn btn-lg btn-block'
    let icon
    let label
    let enabled = true
    if (!connectedToDevice) {
      className += ' btn-warning'
      enabled = false
      icon = 'exclamation-triangle'
      label = 'Not Connected'
    } else if (status === 'idle') {
      action = play
      className += ' btn-success'
      icon = 'play'
      label = 'Start'
    } else if (status === 'run') {
      action = pause
      className += ' btn-primary'
      icon = 'pause'
      label = 'Pause'
    } else if (status === 'hold'){
      action = play
      className += ' btn-success'
      icon = 'play'
      label = 'Resume'
    } else if (status === 'alarm') {
      action = killAlarm
      className += ' btn-warning'
      icon = 'bell-o'
      label = 'Reset Alarm'
    } else if (status === 'error') {
      action = killAlarm
      className += ' btn-danger'
      enabled = false
      icon = 'exclamation-triangle'
      label = 'Restart Machine'
    } else if (status === 'door') {
      action = killAlarm
      className += ' btn-warning'
      enabled = false
      icon = 'exclamation-triangle'
      label = 'Door Open!'
    } else if (status === 'home') {
      // TODO: anything to do here?
      className += ' btn-info'
      enabled = false
      icon = 'home'
      label = 'Homing...'
    } else if (status === 'check') {
      // TODO: anything to do here?
      className += ' btn-info'
      enabled = false
      icon = 'search'
      label = 'Check Running'
    } else {
      // home, door, check, alarm
      enabled = false
      className += ' btn-danger'
      icon = 'question'
      label = 'Unknown State'
    }

    let stopButton
    if (status === 'run' || status === 'hold') {
      stopButton = (
        <button
          className='btn btn-lg btn-block btn-danger'
          onClick={stop}
          title='Stop (shortcut: escape)'
        >
          <FA name='stop' className='p-r-1' />
          {' '}
          Stop
        </button>
      )
    }

    return (
      <div>
        <button
          className={className}
          disabled={!enabled}
          onClick={action}
          title={`${label} (shortcut: space bar)`}
        >
          <FA name={icon} className='p-r-1' />
          {' '}
          {label}
        </button>
        {stopButton}
      </div>
    )
  },

})
