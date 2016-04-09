import FA from 'react-fontawesome'
import numeral from 'numeral'
import React, { PropTypes } from 'react'
import '../styles/machine-coordinates.scss'

export default React.createClass({

  name: 'MachineCoordinates',

  propTypes: {
    homeX: PropTypes.func.isRequired,
    homeY: PropTypes.func.isRequired,
    displayUnits: PropTypes.oneOf(['mm', 'in']).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    zeroX: PropTypes.func.isRequired,
    zeroY: PropTypes.func.isRequired,
  },

  _homeX(e) {
    e.preventDefault()
    this.props.homeX()
  },

  _homeY(e) {
    e.preventDefault()
    this.props.homeY()
  },

  _zeroX(e) {
    e.preventDefault()
    this.props.zeroX()
  },

  _zeroY(e) {
    e.preventDefault()
    this.props.zeroY()
  },

  render() {
    const {
      displayUnits,
      x,
      y,
    } = this.props

    return (
      <div>

        <div className='coordinate-row'>
          <div className='coordinate-label'>
            <div>X</div>
          </div>
          <div className='coordinate-input'>
            <input
              className='form-control text-sm-right'
              readOnly
              value={numeral(x).format('0,0.0000') + displayUnits}
            />
          </div>
          <div className='coordinate-actions'>
            <button
              className='btn btn-secondary'
              onClick={this._zeroX}
            >
              <FA name='ban' title='Zero X axis' />
            </button>
            <button
              className='btn btn-secondary'
              onClick={this._homeX}
            >
              <FA name='home' title='Home X axis' />
            </button>
          </div>
        </div>

        <div className='coordinate-row'>
          <div className='coordinate-label'>
            <div>Y</div>
          </div>
          <div className='coordinate-input'>
            <input
              className='form-control text-sm-right'
              readOnly
              value={numeral(y).format('0,0.0000') + displayUnits}
            />
          </div>
          <div className='coordinate-actions'>
            <button
              className='btn btn-secondary'
              onClick={this._zeroY}
            >
              <FA name='ban' title='Zero Y axis' />
            </button>
            <button
              className='btn btn-secondary'
              onClick={this._homeY}
            >
              <FA name='home' title='Home Y axis' />
            </button>
          </div>
        </div>

      </div>
    )
  },
})
