import FA from 'react-fontawesome'
import React from 'react'

export default React.createClass({

  name: 'Card',

  propTypes: {
    buttons: React.PropTypes.arrayOf(
      React.PropTypes.node
    ),
    //children: React.PropTypes.arrayOf(
      //React.PropTypes.node
    //),
    visible: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      buttons: [],
      visible: true,
    }
  },

  getInitialState() {
    return {
      visible: this.props.visible,
    }
  },

  _toggleVisibility(e) {
    e.preventDefault()
    this.setState({ visible: !this.state.visible })
  },

  render() {
    const title = this.props.title

    const buttons = this.props.buttons.map((button, index) => {
      return (
        <span className='m-r-1' key={index}>
          {button}
        </span>
      )
    })

    return (
      <div className='card'>
        <div className='card-header'>
          <div className='pull-right'>
            {buttons}
            <a href='' onClick={this._toggleVisibility}>
              <FA name={this.state.visible ? 'chevron-up' : 'chevron-down'} />
            </a>
          </div>
          {title}
        </div>
        <div style={{ display: this.state.visible ? 'inherit' : 'none' }}>
          {this.props.children}
        </div>
      </div>
    )
  },
})
