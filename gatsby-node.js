/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
require('dotenv').config()
const mysql = require('mysql')
const crypto = require('crypto')

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})

exports.sourceNodes = async ({ boundActionCreators }) => {
  const { createNode } = boundActionCreators

  const editables = await query(db, 'SELECT * FROM netlifyeditables')

  editables
    .map(editable => ({
      id: `editable-${editable.id}`,
      path: editable.path,
      value: editable.value,
      parent: null,
      children: [],
      internal: {
        type: 'Editable',
        contentDigest: crypto
          .createHash('md5')
          .update(JSON.stringify(editable))
          .digest('hex'),
      },
    }))
    .map(x => createNode(x))

  // const [, body] = await request('https://expose-api-xvswukbzwf.now.sh/read')

  // // Process data into nodes.
  // JSON.parse(body).forEach(datum => createNode(processDatum(datum)))

  // We're done, return.
  return
}

function query(db, str) {
  return new Promise((resolve, reject) => {
    db.query(str, (error, results, fields) => {
      if (error) return reject(error)
      resolve(results)
    })
  })
}
