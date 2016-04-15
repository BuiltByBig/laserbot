import FA from 'react-fontawesome'
import React, { PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { StatusType } from '~/typedefs'

export default React.createClass({

  name: 'LaserStatus',

  propTypes: {
    connectedToDevice: PropTypes.bool.isRequired,
    disableLaser: PropTypes.func.isRequired,
    enabled: PropTypes.bool.isRequired,
    enableLaser: PropTypes.func.isRequired,
    power: PropTypes.number.isRequired,
    status: StatusType.isRequired,
  },

  mixins: [ PureRenderMixin ],

  render() {
    const {
      connectedToDevice,
      disableLaser,
      enabled,
      enableLaser,
      power,
      status,
    } = this.props

    const enableActions = connectedToDevice && status === 'idle'

    const powerDisplay = power ? `${(power / 10)}% Power` : '...'

    return (
      <div className='center-block'>
        <div className='inline-field'>
          <label className='inline-field-label'>
            <div>Laser</div>
          </label>
          <div className='inline-field-input'>
            <input
              className='form-control text-sm-right'
              readOnly
              value={powerDisplay}
            />
          </div>
          <div className='inline-field-actions'>
            {
              enabled ?
                <button
                  className='btn btn-danger'
                  disabled={!enableActions}
                  onClick={disableLaser}
                >
                  <FA
                    fixedWidth
                    name='ban'
                    title='Turn laser off'
                  />
                  {' '}
                  Turn Off Laser
                </button> :
                <button
                  className='btn btn-secondary'
                  disabled={!enableActions}
                  onClick={enableLaser}
                >
                  <FA
                    fixedWidth
                    name='check'
                    title='Turn laser on'
                  />
                  {' '}
                  Turn On Laser
                </button>
            }
          </div>
        </div>
      </div>
    )
  },

})

