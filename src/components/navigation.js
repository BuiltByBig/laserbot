import FA from 'react-fontawesome'
import NotificationBar from './notification-bar'
import React, { PropTypes } from 'react'
import '../styles/navigation.scss'

export default React.createClass({

  name: 'Navigation',

  propTypes: {
    connectedDevice: PropTypes.object,
    connectedToWebsockets: PropTypes.bool.isRequired,
    disconnectFromDevice: PropTypes.func.isRequired,
    dismissNotification: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired,
  },

  render() {
    const {
      connectedDevice,
      connectedToWebsockets,
      disconnectFromDevice,
      dismissNotification,
      notifications,
    } = this.props

    let connection
    if (connectedDevice) {
      connection = (
        <div className='pull-sm-right p-r-2'>
          <span className='text-muted'>
            Connected to {connectedDevice.name}
          </span>
          <button
            className='btn btn-danger btn-sm m-l-2'
            onClick={() => {
              this.props.disconnectFromDevice(connectedDevice.name)
            }}
          >
            <FA name='times' />
            {' '}
            Disconnect
          </button>
        </div>
      )
    }

    return (
      <nav className='navbar navbar-full navbar-dark bg-inverse'>
        <div className='row'>
          <h1 className='navbar-brand pull-sm-left p-l-2'>
            <span className='p-r-1'>Laserbot</span>
            {' '}
            {
              connectedToWebsockets ?
                <FA
                  className='text-success'
                  name='check'
                  title='Connected to Websocket server'
                /> :
                <FA
                  className='text-danger'
                  name='times'
                  title='Disconnected from Websocket server'
                />
            }
          </h1>
          {connection}
          <div className='navigation-notifications'>
            <NotificationBar
              dismissNotification={dismissNotification}
              notifications={notifications}
            />
          </div>
        </div>
      </nav>
    )
  },

})
