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
      order: [['path', 'ASC']],
    }).then(results => {
      const editables = {}
      results.forEach(result => {
        editables[result.path.replace(/!draft$/, '')] = result.value
      })

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
            window.fetch('/.netlify/functions/publish', {
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
          netlifyIdentity.on("init", user => {
            console.log('init', user)
            user.jwt().then(() => {
              const master = window.fetch('/.netlify/git/github/contents/data/editables.json', {
                headers: {
                  Authorization: 'Bearer ' + user.token.access_token
                }
              })
              const draft = window.fetch('/.netlify/git/github/contents/data/editables.json?ref=draft', {
                headers: {
                  Authorization: 'Bearer ' + user.token.access_token
                }
              })
              Promise.all([master, draft]).then(([m, d]) => Promise.all([m.json(), d.json()])).then(res => {
                console.log(window.atob(res[0].content))
                console.log(window.atob(res[1].content))
              })
            })
          });
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
