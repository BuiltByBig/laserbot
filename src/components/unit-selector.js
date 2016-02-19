
import React from 'react'

export default React.createClass({

  name: 'UnitSelector',

  propTypes: {
    changeUnits: React.PropTypes.func.isRequired,
    displayUnits: React.PropTypes.oneOf(['mm', 'in']).isRequired,
  },

  render() {
    const { changeUnits, displayUnits } = this.props

    return (
      <div className='btn-group'>
        <button
          className={displayUnits === 'mm' ? 'btn btn-secondary active' : 'btn btn-secondary'}
          onClick={() => changeUnits('mm')}
        >
          mm
        </button>
        <button
          className={displayUnits === 'in' ? 'btn btn-secondary active' : 'btn btn-secondary'}
          onClick={() => changeUnits('in')}
        >
          in
        </button>
      </div>
    )
  },
})
