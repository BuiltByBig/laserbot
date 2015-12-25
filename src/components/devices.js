import Card from './card'
import FA from 'react-fontawesome'
import React from 'react'

export default React.createClass({

  name: 'Devices',

  propTypes: {
    devices: React.PropTypes.array,
  },

  getDefaultProps() {
    return {
      devices: [],
    }
  },

  render() {

    let devices
    if (this.props.devices.length) {
      const items = this.props.devices.map((port, index) => {
        return (
          <li className="list-group-item" key={index}>
            {port.name}
          </li>
        )
      })

      devices = (
        <ul className="list-group list-group-flush">
          {items}
        </ul>
      )
    } else {
      devices = (
        <div className='alert alert-warning'>
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
              console.log('refresh')
            }}
          >
            <FA name='refresh' />
          </a>
        ]}
        title='Devices'
      >
        {devices}
      </Card>
    )
  },
})
