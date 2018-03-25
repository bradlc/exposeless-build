exports.handler = function(event, context, callback) {
  const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Hello, world</title>
        <style>
        html, body, iframe {
          height: 100%;
          margin: 0;
        }
        iframe {
          width: 100%;
          border: 0;
          opacity: 0;
          pointer-events: none;
        }
        .ready iframe {
          opacity: 1;
          pointer-events: auto;
        }
        </style>
        <script>
        var foo = 'test from parent'
        function ready() {
          document.body.classList.add('ready')
        }
        </script>
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
