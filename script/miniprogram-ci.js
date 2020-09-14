const fs = require('fs')
const ci = require('miniprogram-ci')
const dayjs = require('dayjs')

const config = fs.readFileSync('project.config.json.example')
const { appid } = JSON.parse(config.toString())

const project = new ci.Project({
  appid,
  type: 'miniProgram',
  projectPath: '.',
  privateKeyPath: 'private.key',
})

const isProduction = process.env.TARGET_ENV === 'production'

ci.upload({
  project,
  version: dayjs().format('YYYYMMDDHHmmss'),
  desc: isProduction ? 'production' : 'staging',
  robot: isProduction ? 1 : 2,
  onProgressUpdate: console.log, // eslint-disable-line no-console
}).catch(() => process.exit(1))
