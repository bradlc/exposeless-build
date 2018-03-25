const { spawn, execSync } = require('child_process')
const path = require('path')

module.exports.build = (event, context, callback) => {
  execSync(
    'rm -rf /tmp/gatsby-build && mkdir /tmp/gatsby-build && cp all.zip /tmp/gatsby-build/all.zip'
  )
  execSync('unzip all.zip', { cwd: '/tmp/gatsby-build' })

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
    console.log(`gatsby build exited with code ${code}`)
    callback(null, 'done')
  })
}
