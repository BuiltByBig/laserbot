import Card from './card'
import ConsoleList from './console-list'
import React from 'react'
import '../styles/console.scss'

export default React.createClass({

  name: 'Console',

  propTypes: {
    commands: React.PropTypes.array.isRequired,
    sendCommands: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      disabled: true,
    }
  },

  componentDidUpdate(prevProps) {
    // Check if new message was added, for example:
    //if (this.props.commands.length === prevProps.commands.length + 1) {
      console.log('scroll to bottom')
      const elm = this.refs.container
      elm.scrollTop = elm.scrollHeight
      //textarea.scrollTop = textarea.scrollHeight
    //}
  },

  _handleChange(e) {
    this.setState({ disabled: !this.refs.gcode.value })
  },

  async _handleSubmit(e) {
    e.preventDefault()
    const node = this.refs.gcode
    const val = node.value.trim()
    console.log('form submitted', val)
    await this.props.sendCommands([ val ])
    node.value = ''
    this.setState({ disabled: true })
    // TODO: set state here instead
  },

  render() {

    let commands
    if (this.props.commands.size) {

      commands = (
        <ConsoleList
          commands={this.props.commands}
        />
      )
    } else {
      commands = (
        <p className='text-muted'>No commands yet...</p>
      )
    }

    // TODO: add arrow up navigation of history
    return (
      <div>
        <div
          className='console-container'
          ref='container'
        >
          {commands}
        </div>
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
                className='btn btn-primary'
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
    )
  },

})
