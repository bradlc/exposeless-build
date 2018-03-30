import React from 'react'
import netlifyIdentity from 'netlify-identity-widget'

export default class Admin extends React.Component {
  constructor(props) {
    super(props)
    netlifyIdentity.on('init', user => {
      console.log(user)
    })
  }
  render() {
    return (
      <div>
        <button onClick={() => netlifyIdentity.open()}>login</button>
        <iframe src={window.location.origin} />
      </div>
    )
  }
}
