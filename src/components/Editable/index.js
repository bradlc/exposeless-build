import PropTypes from 'prop-types'
import React, { Component } from 'react'

class Text extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const value = this.context.editables.filter(x => {
      return x.node.path === `${this.context.pageName}!${this.props.name}`
    })[0]

    let adminOverride =
      typeof window !== 'undefined' &&
      window.parent.editables &&
      window.parent.editables.filter(
        x => x.path === `${this.context.pageName}!${this.props.name}`
      )

    if (adminOverride && adminOverride.length > 0) {
      adminOverride = adminOverride[0].value
    } else {
      adminOverride = null
    }

    return (
      <div
        contentEditable
        onBlur={e => {
          window.fetch('/.netlify/functions/update', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              path: `${this.context.pageName}!${this.props.name}`,
              value: e.target.textContent,
            }),
          })
        }}
      >
        {adminOverride ||
          (value && value.node.value) ||
          this.props.initial ||
          'Lorem ipsum'}
      </div>
    )
  }
}

Text.contextTypes = {
  editables: PropTypes.array,
  pageName: PropTypes.string,
}

Text.propTypes = {
  name: PropTypes.string.isRequired,
  initial: PropTypes.string,
}

export default { Text }
