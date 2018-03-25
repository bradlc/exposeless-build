exports.handler = function(event, context, callback) {
  const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Hello, world</title>
        <style>
        html, body {
          height: 100%;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }
        </style>
      </head>
      <body>
        <iframe src="${process.env.URL}"></iframe>
      </body>
    </html>
  `

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: html,
  })
}
