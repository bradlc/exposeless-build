const exec = require('child_process').exec
const path = require('path')
const ncp = require('ncp')
const mkdirp = require('mkdirp')

const files = [
  'src',
  'node_modules',
  'gatsby-browser.js',
  'gatsby-config.js',
  'gatsby-node.js',
  'gatsby-ssr.js',
  'package.json',
]

module.exports.build = (event, context, callback) => {
  mkdirp('/tmp/gatsby-build', () => {
    copyAll(files)
      .then(() => {
        exec(
          `cd /tmp/gatsby-build && ./node_modules/.bin/gatsby build`,
          (err, stdout, stderr) => {
            if (err instanceof Error) {
              callback(err)
              return
            }

            console.log('stdout ', stdout)
            console.log('stderr ', stderr)

            callback(null, 'done')
          }
        )
      })
      .catch(err => callback(err))
  })
}

function copy(file) {
  return new Promise((resolve, reject) => {
    ncp(path.resolve(__dirname, file), `/tmp/gatsby-build/${file}`, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function copyAll(files) {
  return Promise.all(files.map(x => copy(x)))
}
