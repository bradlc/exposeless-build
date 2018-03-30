import React from 'react'
import Link from 'gatsby-link'
import Page from '../components/Page'
import Editable from '../components/Editable'

const IndexPage = () => (
  <Page name="home">
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>

    <Editable.Text name="test" />

    <Link to="/page-2/">Go to page 2</Link>
  </Page>
)

export default IndexPage
