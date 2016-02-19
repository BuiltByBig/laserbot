import Card from './card'
import FA from 'react-fontawesome'
import React from 'react'

export default React.createClass({

  name: 'Console',

  propTypes: {
    commands: React.PropTypes.array,
    sendCommand: React.PropTypes.func.isRequired,
    visible: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      commands: [],
      visible: true,
    }
  },

  getInitialState() {
    return {
      disabled: true,
    }
  },

  _handleChange(e) {
    this.setState({ disabled: !this.refs.gcode.value })
  },

  _handleSubmit(e) {
    e.preventDefault()
    const node = this.refs.gcode
    const val = node.value.trim()
    console.log('form submitted', val)
    this.props.sendCommand(val)
    node.value = ''
    // TODO: set state here instead
  },

  render() {

    let commands
    if (this.props.commands.length) {
      const list = this.props.commands.map((command, index) => {
        return (
          <li key={index}>{command.command}</li>
        )
      })

      commands = (
        <ul className='list-unstyled'>{list}</ul>
      )
    } else {
      commands = (
        <p className='text-muted'>No commands yet...</p>
      )
    }

    return (
      <Card title='Console'>
        <div className='card-block'>
          {commands}
          <form onSubmit={this._handleSubmit}>
            <div className='input-group'>
              <input
                className='form-control'
                onChange={this._handleChange}
                placeholder='Enter GCode...'
                ref='gcode'
                type='text'
              />
              <span className='input-group-btn'>
                <button
                  className='btn btn-secondary'
                  disabled={this.state.disabled}
                  onClick={this._handleSubmit}
                  type='submit'
                >
                  Run
                </button>
              </span>
            </div>
          </form>
        </div>
      </Card>
    )
  },

})
