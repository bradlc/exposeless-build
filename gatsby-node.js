/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
require('dotenv').config()
const crypto = require('crypto')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
    port: 3306,
  }
)

const Editable = sequelize.define(
  'netlifyeditable',
  {
    path: {
      type: Sequelize.STRING,
      unique: true,
    },
    value: {
      type: Sequelize.TEXT,
    },
  },
  { underscored: true }
)

exports.sourceNodes = async ({ boundActionCreators }) => {
  const { createNode } = boundActionCreators

  await Editable.sync()
  const editables = await Editable.findAll()

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
