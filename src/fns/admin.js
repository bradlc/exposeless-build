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
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
        <script>
        netlifyIdentity.on("init", user => console.log('init', user));
        netlifyIdentity.on("login", user => console.log('login', user));
        netlifyIdentity.on("logout", () => console.log("Logged out"));
        netlifyIdentity.on("error", err => console.error("Logged out"));
        netlifyIdentity.on("open", () => console.log("Widget opened"));
        netlifyIdentity.on("close", () => console.log("Widget closed"));
        </script>
      </head>
      <body>
        <div data-netlify-identity-button>Login with Netlify Identity</div>
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
