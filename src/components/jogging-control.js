import FA from 'react-fontawesome'
import key from 'keymaster'
import React, { PropTypes } from 'react'
import '../styles/jogging-control.scss'

export default React.createClass({

  name: 'JoggingControl',

  propTypes: {
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
      homeAll,
      jogXNegative,
      jogXPositive,
      jogYNegative,
      jogYPositive,
      status,
    } = this.props

    return (
      <div className='jogging-control'>
        <div className='jog-y-positive'>
          <button
            className='btn btn-lg btn-secondary'
            disabled={status !== 'idle'}
            onClick={jogYPositive}
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
            disabled={status !== 'idle'}
            onClick={jogXNegative}
          >
            <FA
              name='chevron-left'
              title='Jog in -X'
            />
          </button>
          <button
            className='btn btn-lg btn-secondary'
            disabled={status !== 'idle'}
            onClick={homeAll}
          >
            <FA
              name='home'
              title='Home all axis'
            />
          </button>
          <button
            className='btn btn-lg btn-secondary'
            disabled={status !== 'idle'}
            onClick={jogXPositive}
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
            disabled={status !== 'idle'}
            onClick={jogYNegative}
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
