import React, { PropTypes } from 'react'

export default React.createClass({

  name: 'FormField',

  propTypes: {
    //helpText: PropTypes.string,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.node.isRequired,
  },

  render() {
    const {
      label,
      onChange,
      value,
    } = this.props

    return (
      <div className='form-group'>
        <label>{label}</label>
        <input
          className='form-control'
          onChange={onChange}
          value={value}
        />
      </div>
    )
  },

})
