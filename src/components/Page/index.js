import PropTypes from 'prop-types'
import React from 'react'

class Page extends React.Component {
  getChildContext() {
    return { pageName: this.props.name }
  }

  render() {
    return <div>{this.props.children}</div>
  }
}

Page.childContextTypes = {
  pageName: PropTypes.string,
}

export default Page
