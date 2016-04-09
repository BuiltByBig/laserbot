import FA from 'react-fontawesome'
import React, { PropTypes } from 'react'

export default React.createClass({

  name: 'FileInput',

  propTypes: {
    accept: PropTypes.string.isRequired,
    className: PropTypes.string,
    iconName: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      styles: {
        parent: {
          position: 'relative',
        },
        file: {
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0,
          width: '100%',
          zIndex: 11,
        },
        text: {
          position: 'relative',
          zIndex: 10,
        },
      },
    }
  },

  handleChange(e) {
    this.setState({
      value: e.target.value.split(/(\\|\/)/g).pop(),
    })
    if (this.props.onChange) {
      this.props.onChange(e)
    }
  },

  render() {

    const {
      accept,
      className,
      disabled,
      iconName,
      label,
      name,
      styles,
    } = this.props

    let iconElement
    if (iconName) {
      iconElement = <FA name={iconName} className='p-r-1' />
    }

    return (
      <div style={styles.parent}>
        <input
          type='file'
          name={name}
          className={className}
          onChange={this.handleChange}
          disabled={disabled}
          accept={accept}
          style={styles.file}
        />
        <button
          tabIndex={-1}
          name={name + '_filename'}
          className={className}
          onChange={() => {}}
          disabled={disabled}
          style={styles.text}
        >
          {iconElement}
          {label}
        </button>
      </div>
    )
  }
})
