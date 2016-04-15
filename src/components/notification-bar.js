import FA from 'react-fontawesome'
import React, { PropTypes } from 'react'

export default React.createClass({

  name: 'NotificationBar',

  propTypes: {
    dismissNotification: PropTypes.func.isRequired,
    notifications: PropTypes.array, // arrayOf({ name... })
  },

  getDefaultProps() {
    return {
      notifications: [],
    }
  },

  _dismissNotification(e, index) {
    e.preventDefault()
    this.props.dismissNotification(index)
  },

  render() {
    const {
      notifications,
    } = this.props

    return (
      <ul className='list-unstyled m-a-0'>
        {notifications.map((notification, index) =>
          <li
            className={`bg-${notification.type || 'warning'} p-x-1`}
            key={index}
          >
            <button
              className='close pull-sm-right'
              onClick={(e) => this._dismissNotification(e, index)}
            >
              <span>&times;</span>
            </button>
            <FA name='exclamation-triangle' className='p-r-1' />
            <strong>
              {notification.message}
            </strong>
          </li>
        )}
      </ul>
    )
  },

})
