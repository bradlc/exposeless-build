require('dotenv').config()
const Sequelize = require('sequelize')

exports.handler = function(event, context, callback) {
  const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 9821,
    }
  )

  const Editable = sequelize.define('editable', {
    path: {
      type: Sequelize.STRING,
      unique: true,
    },
    value: {
      type: Sequelize.TEXT,
    },
  })

  const body = JSON.parse(event.body)

  Editable.sync().then(() => {
    Editable.upsert({
      path: body.path,
      value: body.value,
    }).then(() => {
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