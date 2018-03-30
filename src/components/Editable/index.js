import PropTypes from 'prop-types'
import React, { Component } from 'react'

class Text extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onChange = editorState => this.setState({ editorState })
  }

  componentDidMount() {
    let value = this.context.editables.filter(x => {
      return (
        x.node.page === this.context.pageName && x.node.name === this.props.name
      )
    })[0]

    let adminOverride =
      typeof window !== 'undefined' &&
      window.parent.editables &&
      window.parent.editables.filter(
        x => x.page === this.context.pageName && x.name === this.props.name
      )[0]

    value =
      (adminOverride && adminOverride.value) ||
      (value && value.node.value) ||
      this.props.initial ||
      'Lorem ipsum'

    this.setState({ value })

    if (
      typeof window !== 'undefined' &&
      window.parent &&
      window.parent.editables
    ) {
      require.ensure(
        ['draft-js', 'draft-js-import-html'],
        () => {
          const draftjs = require('draft-js')
          const importHtml = require('draft-js-import-html')

          this.Editor = draftjs.Editor
          let contentState = importHtml.stateFromHTML(this.state.value)
          this.setState({
            editorState: draftjs.EditorState.createWithContent(contentState),
          })
        },
        'draft-js-chunk' // chunk name - need to be set to something
      )
    }
  }

  // componentDidMount() {
  //   if (
  //     typeof window !== 'undefined' &&
  //     window.parent &&
  //     window.parent.editables
  //   ) {
  //     // import { Editor, EditorState } from 'draft-js'
  //     // import { stateFromHTML } from 'draft-js-import-html'
  //     Promise.all([import('draft-js'), import('draft-js-import-html')]).then(
  //       ([draftjs, draftjsImportHtml]) => {
  //         console.log(Editor)
  //       }
  //     )
  //   }
  //   // let contentState = stateFromHTML('<p>hello world</p>')
  //   // this.state = { editorState: EditorState.createWithContent(contentState) }
  //   // this.onChange = editorState => this.setState({ editorState })
  // }

  render() {
    return this.state.editorState ? (
      <this.Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
    ) : (
      <div>{this.state.value}</div>
    )

    // return (
    //   <div
    //     contentEditable
    //     onBlur={e => {
    //       window.parent &&
    //         window.parent.save({
    //           page: this.context.pageName,
    //           name: this.props.name,
    //           value: e.target.textContent,
    //         })
    //     }}
    //   >
    //     {this.state.value}
    //   </div>
    // )
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
