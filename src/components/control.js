import Card from './card'
import FA from 'react-fontawesome'
import key from 'keymaster'
import React from 'react'

export default React.createClass({

  name: 'Control',

  propTypes: {
    status: React.PropTypes.oneOf(['playing', 'paused', 'stopped']),
    sendCommand: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      status: 'stopped',
    }
  },

  componentWillMount() {
    key('space', (e) => {
      e.preventDefault()
      if (this.state.status === 'paused') {
        this.handlePlay()
      } else {
        this.handlePause()
      }
    })
  },

  componentWillUnmount() {
    key.unbind('space')
  },

  handlePlay() {
    console.log('playing')
    this.setState({
      status: 'playing',
    })
  },

  handlePause() {
    console.log('pausing')
    this.setState({
      status: 'paused',
    })
  },

  handleStop() {
    console.log('stopping')
    this.setState({
      status: 'stopped',
    })
  },

  render() {
    const { status } = this.state

    let playPauseBtn
    if (status === 'paused' || status === 'stopped') {
      playPauseBtn = (
        <button
          className={'btn btn-success'}
          disabled={status === 'playing'}
          onClick={this.handlePlay}
        >
          <FA name='play' title='Run commands' />
          {' '}
          Play
        </button>
      )
    } else {
      playPauseBtn = (
        <button
          className='btn btn-secondary'
          disabled={status === 'paused' || status === 'stopped'}
          onClick={this.handlePause}
        >
          <FA name='pause' title='Pause commands' />
          {' '}
          Pause
        </button>
      )
    }

    return (
      <Card title='Control'>
        <div className='card-block'>
          <div className='btn-group'>
            {playPauseBtn}
            <button
              className='btn btn-secondary'
              disabled={status === 'stopped'}
              onClick={this.handleStop}
            >
              <FA name='stop' title='Stop commands' />
            </button>
          </div>
        </div>
      </Card>
    )
  },

})
