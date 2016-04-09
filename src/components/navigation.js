import NotificationBar from './notification-bar'
import React, { PropTypes } from 'react'
import '../styles/navigation.scss'

export default React.createClass({

  name: 'Navigation',

  propTypes: {
    dismissNotification: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired,
  },

  render() {
    const {
      dismissNotification,
      notifications,
    } = this.props

    return (
      <nav className='navbar navbar-full navbar-dark bg-inverse'>
        <div className='row'>
          <h1 className='navbar-brand pull-sm-left p-l-2'>Laserbot</h1>
          <div className='pull-sm-right'>
            <p>Device connections here...</p>
          </div>
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
