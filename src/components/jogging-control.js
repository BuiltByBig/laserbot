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
    } = this.props

    return (
      <div className='jogging-control'>
        <div className='jog-y-positive'>
          <button
            className='btn btn-lg btn-secondary'
            onClick={jogYPositive}
          >
            <FA name='chevron-up' />
          </button>
        </div>
        <div className='jog-x'>
          <button
            className='btn btn-lg btn-secondary'
            onClick={jogXNegative}
          >
            <FA name='chevron-left' />
          </button>
          <button
            className='btn btn-lg btn-secondary'
            onClick={homeAll}
          >
            <FA name='home' />
          </button>
          <button
            className='btn btn-lg btn-secondary'
            onClick={jogXPositive}
          >
            <FA name='chevron-right' />
          </button>
        </div>
        <div className='jog-y-negative'>
          <button
            className='btn btn-lg btn-secondary'
            onClick={jogYNegative}
          >
            <FA name='chevron-down' />
          </button>
        </div>
      </div>
    )
  },

})
