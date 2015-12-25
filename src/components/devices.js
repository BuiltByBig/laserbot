import React from 'react'

export default React.createClass({

  name: 'Devices',

  propTypes: {
    ports: React.PropTypes.array,
  },

  getDefaultProps() {
    return {
      ports: [],
    }
  },

  render() {

    let ports
    if (this.props.ports.length) {
      const items = this.props.ports.map((port, index) => {
        return (
          <li className="list-group-item" key={index}>
            {port.Friendly}
          </li>
        )
      })

      ports = (
        <ul className="list-group list-group-flush">
          {items}
        </ul>
      )
    } else {
      ports = (
        <div className='alert alert-warning'>
          No ports available, make sure serial-port-json-server is running!
        </div>
      )
    }

    return (
      <div className='card'>
        <div className="card-header">
          <div className='pull-sm-right'>
            <i className='fa fa-refresh' />
          </div>
          Devices
        </div>
        {ports}
      </div>
    )
  },
})
