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
            className='text-warning'
            key={index}
          >
            {notification.message}
            <a
              href=''
              onClick={(e) => this._dismissNotification(e, index)}
            >
              X
            </a>
          </li>
        )}
      </ul>
    )
  },

})
