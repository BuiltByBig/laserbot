import _ from 'lodash'
import Card from './card'
import Device from '../typedefs'
import FA from 'react-fontawesome'
import React, { PropTypes } from 'react'

export default React.createClass({

  name: 'Devices',

  propTypes: {
    didInvalidate: PropTypes.bool,
    isFetching: PropTypes.bool,
    //items: PropTypes.arrayOf(Device),
    lastUpdated: PropTypes.instanceOf(Date),
    fetchDevices: PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      didInvalidate: false,
      isFetching: false,
      //items: [],
      lastUpdated: null,
    }
  },

  getInitialState() {
    return {
      items: [
        {
          name: 'Ardunio Uno',
          open: true,
          location: '/dev/cu.usbmodem1411',
        },
        {
          name: 'tty.Bluetooth.Something',
          open: false,
          location: '/dev/tty.Bluetooth-Incoming-Port',
        },
        {
          name: 'RapberryPi 2',
          open: false,
          location: '/dev/tty.raspberrypi',
        },
      ],
    }
  },

  handleConnect(location) {
    console.log('connect', location)
    const items = this.state.items.map((item) => {
      if (item.location === location) {
        item.open = true
      }

      return item
    })
    this.setState({ items })
  },

  handleDisconnect(location) {
    const items = this.state.items.map((item) => {
      if (item.location === location) {
        item.open = false
      }

      return item
    })
    this.setState({ items })
    console.log('disconnect', location)
  },

  render() {
    const {
      didInvalidate,
      isFetching,
      //items,
      lastUpdated,
      fetchDevices,
    } = this.props

    const { items } = this.state

    let content
    if (didInvalidate) {
      content = (
        <div className='card-block text-muted'>
          Device fetching cancelled
        </div>
      )
    } else if (isFetching) {
      content = (
        <div className='card-block text-muted'>
          Fetching devices...
        </div>
      )
    } else if (items.length) {
      console.log(items)
      const sorted = _.sortBy(items, (device) => !device.open)
      const devices = sorted.map((device, index) => {
        return (
          <tr
            className={device.open ? 'table-success' : ''}
            key={index}
          >
            {/*
            <div className='text-muted pull-right'>
              <small>{device.location}</small>
            </div>
            */}
            <td style={{ width: '7rem' }}>
              <button
                className={device.open ? 'btn btn-danger-outline btn-xsm' : 'btn btn-success-outline btn-xsm'}
                onClick={() => device.open ? this.handleDisconnect(device.location) : this.handleConnect(device.location)}
              >
                <FA name={device.open ? 'times' : 'plug'} />
                {' '}
                {device.open ? 'Disconnect' : 'Connect'}
              </button>
            </td>
            <td>
              {device.name}
            </td>
          </tr>
        )
      })

      content = (
        <table className='table m-a-0'>
          <tbody>
            {devices}
          </tbody>
        </table>
      )
    } else {
      content = (
        <div className='alert alert-warning m-b-0'>
          No devices available, make sure serial-port-json-server is running!
        </div>
      )
    }

    return (
      <Card
        buttons={[
          <a
            href=''
            onClick={(e) => {
              e.preventDefault()
              fetchDevices()
            }}
          >
            <FA name='refresh' />
          </a>
        ]}
        title='Devices'
      >
        {content}
      </Card>
    )
  },
})
