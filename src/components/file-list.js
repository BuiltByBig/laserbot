import React, { PropTypes } from 'react'

export default React.createClass({

  name: 'FileList',

  propTypes: {
    files: PropTypes.array, // arrayOf({ name... })
    removeFile: PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      files: [],
    }
  },

  _removeFile(e, index) {
    e.preventDefault()
    this.props.removeFile(index)
  },

  render() {
    const {
      files,
    } = this.props

    return (
      <ul>
        {files.map((file, index) =>
          <li key={index}>
            <a
              className='pull-sm-right'
              href=''
              onClick={(e) => this._removeFile(e, index)}
            >
              X
            </a>
            {file.name}
          </li>
        )}
      </ul>
    )
  },

})
