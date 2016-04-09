import _ from 'lodash'
import Card from './card'
import Device from '../typedefs'
import FA from 'react-fontawesome'
import React, { PropTypes } from 'react'

export default React.createClass({

  name: 'Devices',

  propTypes: {
    //didInvalidate: PropTypes.bool,
    //isFetching: PropTypes.bool,
    //devices: PropTypes.arrayOf(Device).isRequired,
    connectToDevice: PropTypes.func.isRequired,
    devices: PropTypes.array.isRequired,
    //lastUpdated: PropTypes.instanceOf(Date),
    fetchDevices: PropTypes.func.isRequired,
  },

  //getDefaultProps() {
    //return {
      //didInvalidate: false,
      //isFetching: false,
      //devices: [],
      //lastUpdated: null,
    //}
  //},

  _handleConnect(name) {
    const devices = this.props.devices.map((device) => {
      if (device.name === name) {
        device.open = true
      }

      return device
    })
    console.log('devices', devices)
    this.setState({ devices })
    this.props.connectToDevice(name)
  },

  _handleDisconnect(location) {
    const devices = this.props.devices.map((item) => {
      if (item.location === location) {
        item.open = false
      }

      return item
    })
    this.setState({ devices })
    console.log('disconnect', location)
  },

  render() {
    const {
      //didInvalidate,
      //isFetching,
      devices,
      //lastUpdated,
      //fetchDevices,
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
          {/*
          <div className='text-muted pull-right'>
            <small>{device.location}</small>
          </div>
          */}
          <td className={device.open ? 'text-success' : ''}>
            {device.name}
          </td>
          <td style={{ width: '7rem' }}>
            <button
              className={device.open ? 'btn btn-danger-outline btn-xsm' : 'btn btn-success-outline btn-xsm'}
              onClick={() => device.open ? this._handleDisconnect(device.location) : this._handleConnect(device.name)}
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
      <table className='table m-a-0 table-sm'>
        <tbody>
          {table}
        </tbody>
      </table>
    )

    //let content
    //if (didInvalidate) {
      //content = (
        //<div className='card-block text-muted'>
          //Device fetching cancelled
        //</div>
      //)
    //} else if (isFetching) {
      //content = (
        //<div className='card-block text-muted'>
          //Fetching devices...
        //</div>
      //)
    //} else if (devices.length) {
      //const sorted = _.sortBy(devices, (device) => !device.open)
      //const devices = sorted.map((device, index) => {
        //return (
          //<tr
            //className={device.open ? 'table-success' : ''}
            //key={index}
          //>
            //{[>
            //<div className='text-muted pull-right'>
              //<small>{device.location}</small>
            //</div>
            //*/}
            //<td style={{ width: '7rem' }}>
              //<button
                //className={device.open ? 'btn btn-danger-outline btn-xsm' : 'btn btn-success-outline btn-xsm'}
                //onClick={() => device.open ? this._handleDisconnect(device.location) : this._handleConnect(device.location)}
              //>
                //<FA name={device.open ? 'times' : 'plug'} />
                //{' '}
                //{device.open ? 'Disconnect' : 'Connect'}
              //</button>
            //</td>
            //<td>
              //{device.name}
            //</td>
          //</tr>
        //)
      //})

      //content = (
        //<table className='table m-a-0'>
          //<tbody>
            //{devices}
          //</tbody>
        //</table>
      //)
    //} else {
      //content = (
        //<div className='alert alert-warning m-b-0'>
          //No serial devices available.
        //</div>
      //)
    //}

    //return (
      //<Card
        //buttons={[
          //<a
            //href=''
            //onClick={(e) => {
              //e.preventDefault()
              //fetchDevices()
            //}}
          //>
            //<FA name='refresh' />
          //</a>
        //]}
        //title='Devices'
      //>
        //{content}
      //</Card>
    //)
  },
})
