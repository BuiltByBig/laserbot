import React from 'react'

export default React.createClass({

  name: 'Console',

  propTypes: {
    commands: React.PropTypes.array,
  },

  getDefaultProps() {
    return {
      commands: [],
    }
  },

  render() {

    let commands
    if (this.props.commands.length) {
      const list = this.props.commands.map((command, index) => {
        return (
          <li key={index}>{command}</li>
        )
      })

      commands = (
        <ul className='list-unstyled'>{list}</ul>
      )
    } else {
      commands = (
        <p className='text-muted'>No commands yet...</p>
      )
    }

    return (
      <div className='card'>
        <div className="card-header">Console</div>
        <div className='card-block'>
          <div className='card-text'>
            {commands}
          </div>

          <form onSubmit={(e) => {
            e.preventDefault()
            console.log('form submitted')
          }}>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder='Enter GCode...' />
              <span className='input-group-btn'>
                <button className='btn btn-secondary' type='button'>Run</button>
              </span>
            </div>
          </form>

        </div>
      </div>
    )
  },

})
