const { execSync } = require('child_process')
const fs = require('fs')

const isProduction = process.argv[2] === 'production'

execSync('yarn install')
execSync(isProduction ? 'yarn build' : 'yarn staging')

const ci = require('miniprogram-ci')
const dayjs = require('dayjs')

const config = fs.readFileSync('project.config.json.example')
const { appid } = JSON.parse(config.toString())
fs.writeFileSync('project.config.json', config)

const project = new ci.Project({
  appid,
  type: 'miniProgram',
  projectPath: '.',
  privateKeyPath: 'private.key',
})

ci.upload({
  project,
  version: dayjs().format('YYYYMMDDHHmmss'),
  desc: isProduction ? 'production' : 'staging',
  robot: isProduction ? 1 : 2,
  onProgressUpdate: console.log, // eslint-disable-line no-console
})
