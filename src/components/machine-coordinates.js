import FA from 'react-fontawesome'
import numeral from 'numeral'
import React from 'react'
import '../styles/machine-coordinates.scss'

export default React.createClass({

  name: 'MachineCoordinates',

  propTypes: {
    homeX: React.PropTypes.func.isRequired,
    homeY: React.PropTypes.func.isRequired,
    displayUnits: React.PropTypes.oneOf(['mm', 'in']).isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
  },

  _homeX(e) {
    e.preventDefault()
    this.props.homeX()
  },

  _homeY(e) {
    e.preventDefault()
    this.props.homeY()
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
              onClick={this._homeX}
            >
              <FA name='home' />
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
              onClick={this._homeY}
            >
              <FA name='home' />
            </button>
          </div>
        </div>

      </div>
    )
  },
})
