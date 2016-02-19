import React from 'react'

export default React.createClass({

  name: 'JogDistanceSelector',

  propTypes: {
    setStepDistance: React.PropTypes.func.isRequired,
    stepDistance: React.PropTypes.number.isRequired,
  },

  setStepDistance(e) {
    e.preventDefault()
    this.props.setStepDistance(parseFloat(this.refs.distance.value))
  },

  render() {
    const { stepDistance, displayUnits } = this.props

    return (
      <form
        className='form-inline'
        onSubmit={this.setStepDistance}
      >
        <label>Jog Distance</label>
        <br />
        <div className='input-group'>
          <div className='input-group-addon'>Current: {stepDistance}{displayUnits}</div>
          <input
            className='form-control'
            defaultValue={stepDistance}
            onBlur={this.setStepDistance}
            ref='distance'
          />
        </div>
        <button
          className='btn btn-primary'
          onClick={this.setStepDistance}
        >
          Set
        </button>
      </form>
    )
  },
})
