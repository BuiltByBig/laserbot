import capitalize from 'capitalize'
import FA from 'react-fontawesome'
import React, { PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'

export default React.createClass({

  name: 'ConsoleItem',

  propTypes: {
    content: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  },

  mixins: [ PureRenderMixin ],

  render() {
    const {
      content,
      type,
    } = this.props

    const icon = type === 'user' ? 'user' : 'desktop'

    console.log('add item', content)

    return (
      <li className={`${type}-command`}>
        <FA
          className='p-r-3'
          fixedWidth
          name={icon}
          title={`${capitalize(type)} command`}
        />
        {content}
      </li>
    )
  },

})

