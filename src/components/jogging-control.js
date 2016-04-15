import FA from 'react-fontawesome'
import key from 'keymaster'
import React, { PropTypes } from 'react'
import '../styles/jogging-control.scss'

export default React.createClass({

  name: 'JoggingControl',

  propTypes: {
    connectedToDevice: PropTypes.bool.isRequired,
    homeAll: PropTypes.func.isRequired,
    jogXNegative: PropTypes.func.isRequired,
    jogXPositive: PropTypes.func.isRequired,
    jogYNegative: PropTypes.func.isRequired,
    jogYPositive: PropTypes.func.isRequired,
    shortcutsEnabled: PropTypes.bool.isRequired,
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
  },

  componentWillMount() {
    if (this.props.shortcutsEnabled) {
      key('down', (e) => {
        e.preventDefault()
        this.props.jogYNegative()
      })
      key('h', (e) => {
        e.preventDefault()
        this.props.homeAll()
      })
      key('left', (e) => {
        e.preventDefault()
        this.props.jogXNegative()
      })
      key('right', (e) => {
        e.preventDefault()
        this.props.jogXPositive()
      })
      key('up', (e) => {
        e.preventDefault()
        this.props.jogYPositive()
      })
    }
  },

  componentWillUnmount() {
    key.unbind('down')
    key.unbind('h')
    key.unbind('left')
    key.unbind('right')
    key.unbind('up')
  },

  render() {
    const {
      connectedToDevice,
      homeAll,
      jogXNegative,
      jogXPositive,
      jogYNegative,
      jogYPositive,
      status,
    } = this.props

    const enabled = connectedToDevice && status === 'idle'

    const nonop = () => console.warn('command not enabled when disconnected!')

    return (
      <div className='jogging-control'>
        <div className='jog-y-positive'>
          <button
            className='btn btn-lg btn-secondary'
            disabled={!enabled}
            onClick={enabled ? jogYPositive : nonop}
          >
            <FA
              name='chevron-up'
              title='Jog in +Y'
            />
          </button>
        </div>
        <div className='jog-x'>
          <button
            className='btn btn-lg btn-secondary'
            disabled={!enabled}
            onClick={enabled ? jogXNegative : nonop}
          >
            <FA
              name='chevron-left'
              title='Jog in -X'
            />
          </button>
          <button
            className='btn btn-lg btn-secondary'
            disabled={!enabled}
            onClick={enabled ? homeAll : nonop}
          >
            <FA
              name='home'
              title='Home all axis'
            />
          </button>
          <button
            className='btn btn-lg btn-secondary'
            disabled={!enabled}
            onClick={enabled ? jogXPositive : nonop}
          >
            <FA
              name='chevron-right'
              title='Jog in +X'
            />
          </button>
        </div>
        <div className='jog-y-negative'>
          <button
            className='btn btn-lg btn-secondary'
            disabled={!enabled}
            onClick={enabled ? jogYNegative : nonop}
          >
            <FA
              name='chevron-down'
              title='Jog in -Y'
            />
          </button>
        </div>
      </div>
    )
  },

})
