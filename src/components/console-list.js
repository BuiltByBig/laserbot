import ConsoleItem from './console-item'
import React, { PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export default React.createClass({

  name: 'ConsoleList',

  propTypes: {
    commands: PropTypes.array.isRequired,
  },

  mixins: [ PureRenderMixin ],

  render() {
    const {
      commands,
    } = this.props

    const list = commands.map((command, index) => {
      return (
        <ConsoleItem
          content={command.content}
          key={index}
          type={command.type}
        />
      )
    })

    return (
      <ul className='timeline list-unstyled m-b-0'>{list}</ul>
    )
  },

})

