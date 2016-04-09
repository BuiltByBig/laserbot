import _ from 'lodash'
import Card from './card'
import Device from '../typedefs'
import FA from 'react-fontawesome'
import React, { PropTypes } from 'react'

export default React.createClass({

  name: 'Devices',

  propTypes: {
    connectToDevice: PropTypes.func.isRequired,
    devices: PropTypes.array.isRequired, //Of(Device).isRequired,
    disconnectFromDevice: PropTypes.func.isRequired,
    fetchDevices: PropTypes.func.isRequired,
  },

  _handleClick(device) {
    if (device.open) {
      this.props.disconnectFromDevice(device.name)
    } else {
      this.props.connectToDevice(device.name)
    }
  },

  render() {
    const {
      devices,
    } = this.props

    if (!devices.length) {
      return (
        <div className='alert alert-warning m-b-0'>
          No serial devices available.
        </div>
      )
    }

    const sorted = _.sortBy(devices, (device) => !device.open)
    const table = sorted.map((device, index) => {
      return (
        <tr
          key={index}
        >
          <td className={device.open ? 'text-success' : ''}>
            {device.name}
          </td>
          <td style={{ width: '7rem' }}>
            <button
              className={device.open ? 'btn btn-danger-outline btn-xsm' : 'btn btn-success-outline btn-xsm'}
              onClick={() => this._handleClick(device)}
            >
              <FA name={device.open ? 'times' : 'plug'} />
              {' '}
              {device.open ? 'Disconnect' : 'Connect'}
            </button>
          </td>
        </tr>
      )
    })

    return (
      <table className='table'>
        <tbody>
          {table}
        </tbody>
      </table>
    )
  },
})
