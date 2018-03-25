import Sequelize from 'sequelize'

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

  Editable.sync().then(() => {
    Editable.findAll({
      where: {
        path: {
          [Sequelize.Op.regexp]: '!draft$',
        },
      },
    }).then(editables => {
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
          button {
            position: fixed;
            z-index: 100;
            right: 20px;
            bottom: 20px;
          }
          </style>
        </head>
        <body>
          <div data-netlify-identity-button>Login with Netlify Identity</div>
          <iframe src="${process.env.URL}"></iframe>
          <button type="button" id="publish">Publish</button>

          <script>
          var foo = 'test from parent'
          function ready() {
            document.body.classList.add('ready')
          }

          var editables = ${JSON.stringify(editables)};

          publish.addEventListener('click', function() {
            window.fetch('https://api.netlify.com/build_hooks/5ab7b865efbe5d5ddc48f317', {
              method: 'post',
              headers: {
                'content-type': 'application/json'
              },
              body: '{}'
            })
          });
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
    })
  })
}
