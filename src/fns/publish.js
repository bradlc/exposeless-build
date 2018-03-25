require('dotenv').config()
const Sequelize = require('sequelize')

exports.handler = function(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false

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

  Editable.sync()
    .then(() =>
      Editable.findAll({
        where: {
          path: {
            [Sequelize.Op.regexp]: '!draft$',
          },
        },
      })
    )
    .then(editables => {
      Promise.all(
        editables.map(editable =>
          Editable.upsert({
            path: editable.path.replace(/!draft$/, ''),
            value: editable.value,
          })
        )
      )
        .then(() =>
          Promise.all(
            editables.map(editable =>
              Editable.destroy({ where: { id: editable.id } })
            )
          )
        )
        .then(() => {
          callback(null, {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'ok' }),
          })
        })
    })
}
