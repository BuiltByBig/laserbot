import FA from 'react-fontawesome'
import numeral from 'numeral'
import React from 'react'

export default React.createClass({

  name: 'MachineCoordinates',

  propTypes: {
    homeX: React.PropTypes.func.isRequired,
    homeY: React.PropTypes.func.isRequired,
    homeZ: React.PropTypes.func.isRequired,
    displayUnits: React.PropTypes.oneOf(['mm', 'in']).isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    z: React.PropTypes.number.isRequired,
  },

  handleHomeX(e) {
    e.preventDefault()
    this.props.homeX()
  },

  handleHomeY(e) {
    e.preventDefault()
    this.props.homeY()
  },

  handleHomeZ(e) {
    e.preventDefault()
    this.props.homeZ()
  },

  render() {
    const { displayUnits, x, y, z } = this.props

    return (
      <form className='form-inline'>
        <div className='input-group'>
          <div className='input-group-addon'>X</div>
          <input
            className='form-control form-control-lg text-sm-right'
            readOnly
            value={numeral(x).format('0,0.0000') + displayUnits}
          />
        </div>
        <button
          className='btn btn-secondary btn-lg'
          onClick={this.handleHomeX}
        >
          <FA name='home' />
        </button>
        <div className='input-group'>
          <div className='input-group-addon'>Y</div>
          <input
            className='form-control form-control-lg text-sm-right'
            readOnly
            value={numeral(y).format('0,0.0000') + displayUnits}
          />
        </div>
        <button
          className='btn btn-secondary btn-lg'
          onClick={this.handleHomeY}
        >
          <FA name='home' />
        </button>
        <div className='input-group'>
          <div className='input-group-addon'>Z</div>
          <input
            className='form-control form-control-lg text-sm-right'
            readOnly
            value={numeral(z).format('0,0.0000') + displayUnits}
          />
        </div>
        <button
          className='btn btn-secondary btn-lg'
          onClick={this.handleHomeZ}
        >
          <FA name='home' />
        </button>
      </form>
    )
  },
})
