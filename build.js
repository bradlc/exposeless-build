const spawn = require('child_process').spawn
const execSync = require('child_process').execSync
const path = require('path')
const ncp = require('ncp')
const mkdirp = require('mkdirp')

const files = [
  'src',
  // 'node_modules',
  'gatsby-browser.js',
  'gatsby-config.js',
  'gatsby-node.js',
  'gatsby-ssr.js',
  'package.json',
]

module.exports.build = (event, context, callback) => {
  mkdirp('/tmp/gatsby-build', () => {
    console.log('made dir')
    copyAll(files)
      .then(() => {
        console.log('copied files')
        execSync('ln -s ./node_modules /tmp/gatsby-build/node_modules')
        console.log('created symlink')
        const build = spawn('./node_modules/.bin/gatsby', ['build'], {
          cwd: '/tmp/gatsby-build',
        })

        build.stdout.on('data', data => {
          console.log(`stdout: ${data}`)
        })

        build.stderr.on('data', data => {
          console.log(`stderr: ${data}`)
        })

        build.on('close', code => {
          console.log(`child process exited with code ${code}`)
          callback(null, 'done')
        })
        // exec(
        //   `cd /tmp/gatsby-build && ./node_modules/.bin/gatsby build`,
        //   (err, stdout, stderr) => {
        //     console.log('hi')
        //     if (err instanceof Error) {
        //       callback(err)
        //       return
        //     }

        //     console.log('wat')

        //     console.log('stdout ', stdout)
        //     console.log('stderr ', stderr)

        //     callback(null, 'done')
        //   }
        // )
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
