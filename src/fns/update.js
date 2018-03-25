require('dotenv').config()
const mysql = require('mysql')

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})

exports.handler = function(event, context, callback) {
  const body = JSON.parse(event.body)

  db.query(
    'INSERT INTO netlifyeditables (path, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
    [body.path, body.value, body.value],
    (error, results, fields) => {
      callback(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ok' }),
      })
      db.end()
    }
  )
}
