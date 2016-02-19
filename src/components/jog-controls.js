import FA from 'react-fontawesome'
import React from 'react'

export default React.createClass({

  name: 'JogControls',

  propTypes: {
    goHome: React.PropTypes.func.isRequired,
    stepDistance: React.PropTypes.number.isRequired,
    stepX: React.PropTypes.func.isRequired,
    stepY: React.PropTypes.func.isRequired,
    stepZ: React.PropTypes.func.isRequired,
  },

  stepNegX() {
    this.props.stepX(-(this.props.stepDistance))
  },

  stepPosX() {
    this.props.stepX(this.props.stepDistance)
  },

  stepNegY() {
    this.props.stepY(-(this.props.stepDistance))
  },

  stepPosY() {
    this.props.stepY(this.props.stepDistance)
  },

  stepNegZ() {
    this.props.stepZ(-(this.props.stepDistance))
  },

  stepPosZ() {
    this.props.stepZ(this.props.stepDistance)
  },

  render() {
    const { goHome } = this.props

    return (
      <div className='row'>
        <div className='col-md-6 text-sm-center'>
          <button className='btn btn-secondary' onClick={this.stepPosY}>
            <FA name='chevron-up' size='2x' />
          </button>
          <br />
          <button className='btn btn-secondary' onClick={this.stepNegX}>
            <FA name='chevron-left' size='2x' />
          </button>
          <button className='btn btn-secondary' onClick={goHome}>
            <FA name='home' size='2x' />
          </button>
          <button className='btn btn-secondary' onClick={this.stepPosX}>
            <FA name='chevron-right' size='2x' />
          </button>
          <br />
          <button className='btn btn-secondary' onClick={this.stepNegY}>
            <FA name='chevron-down' size='2x' />
          </button>
        </div>
        <div className='col-md-6'>
          <button className='btn btn-secondary' onClick={this.stepPosZ}>
            <FA name='chevron-up' size='2x' />
          </button>
          <br />
          <button className='btn btn-secondary' onClick={this.stepNegZ}>
            <FA name='chevron-down' size='2x' />
          </button>
        </div>
      </div>
    )
  },
})
