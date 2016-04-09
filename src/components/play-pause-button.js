import Card from './card'
import FA from 'react-fontawesome'
import key from 'keymaster'
import React, { PropTypes } from 'react'

export default React.createClass({

  name: 'Control',

  propTypes: {
    pause: PropTypes.func.isRequired,
    play: PropTypes.func.isRequired,
    status: PropTypes.oneOf([
      'alarm',
      'check',
      'door',
      'hold',
      'home',
      'idle',
      'run',
    ]).isRequired,
  },

  componentWillMount() {
    key('space', (e) => {
      e.preventDefault()
      const status = this.state.status
      if (status === 'hold' || status === 'idle') {
        this.props.resume()
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
      pause,
      play,
      status,
    } = this.props

    let action = play
    let className = 'btn btn-lg btn-block'
    let icon = 'play'
    let label = 'Play'
    let enabled = true
    if (status === 'run') {
      action = pause
      className += ' btn-primary'
      icon = 'pause'
      label = 'Pause'
    } else {
      className += ' btn-success'
      enabled = status !== 'idle' || status !== 'hold'
    }

    return (
      <button
        className={className}
        disabled={!enabled}
        onClick={action}
      >
        <FA name={icon} className='p-r-1' />
        {' '}
        {label}
      </button>
    )
  },

})
