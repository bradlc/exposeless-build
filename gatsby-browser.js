/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

exports.onInitialClientRender = () => {
  if (typeof window.parent.ready !== 'undefined') {
    window.parent.ready()
  }
}
