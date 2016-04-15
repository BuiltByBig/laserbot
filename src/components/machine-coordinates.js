import FA from 'react-fontawesome'
import numeral from 'numeral'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import React, { PropTypes } from 'react'
import { StatusType } from '~/typedefs'
import '~/styles/machine-coordinates.scss'

export default React.createClass({

  name: 'MachineCoordinates',

  propTypes: {
    connectedToDevice: PropTypes.bool.isRequired,
    homeX: PropTypes.func.isRequired,
    homeY: PropTypes.func.isRequired,
    displayUnits: PropTypes.oneOf(['mm', 'in']).isRequired,
    status: StatusType.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    zeroX: PropTypes.func.isRequired,
    zeroY: PropTypes.func.isRequired,
  },

  mixins: [ PureRenderMixin ],

  _homeX(e) {
    e.preventDefault()

    if (!this.props.connectedToDevice) {
      return console.warnt('cannot home X when disconnected from device!')
    }

    this.props.homeX()
  },

  _homeY(e) {
    e.preventDefault()

    if (!this.props.connectedToDevice) {
      return console.warnt('cannot home Y when disconnected from device!')
    }

    this.props.homeY()
  },

  _zeroX(e) {
    e.preventDefault()

    if (!this.props.connectedToDevice) {
      return console.warnt('cannot zero X when disconnected from device!')
    }

    this.props.zeroX()
  },

  _zeroY(e) {
    e.preventDefault()

    if (!this.props.connectedToDevice) {
      return console.warnt('cannot zero Y when disconnected from device!')
    }

    this.props.zeroY()
  },

  render() {
    const {
      connectedToDevice,
      displayUnits,
      status,
      x,
      y,
    } = this.props

    const enabled = connectedToDevice && status === 'idle'

    return (
      <div>

        <div className='inline-field'>
          <div className='inline-field-label'>
            <div>X</div>
          </div>
          <div className='inline-field-input'>
            <input
              className='form-control text-sm-right'
              readOnly
              value={numeral(x).format('0,0.000') + displayUnits}
            />
          </div>
          <div className='inline-field-actions'>
            <button
              className='btn btn-secondary'
              disabled={!enabled}
              onClick={this._zeroX}
            >
              <FA name='ban' title='Zero X axis' />
            </button>
            <button
              className='btn btn-secondary'
              disabled={!enabled}
              onClick={this._homeX}
            >
              <FA name='home' title='Home X axis' />
            </button>
          </div>
        </div>

        <div className='inline-field'>
          <div className='inline-field-label'>
            <div>Y</div>
          </div>
          <div className='inline-field-input'>
            <input
              className='form-control text-sm-right'
              readOnly
              value={numeral(y).format('0,0.000') + displayUnits}
            />
          </div>
          <div className='inline-field-actions'>
            <button
              className='btn btn-secondary'
              disabled={!enabled}
              onClick={this._zeroY}
            >
              <FA name='ban' title='Zero Y axis' />
            </button>
            <button
              className='btn btn-secondary'
              disabled={!enabled}
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
