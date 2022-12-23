#!/usr/bin/env node

const { prompt } = require('inquirer')
const { inc } = require('semver')
const { echo, exec } = require('shelljs')
const { green, yellow } = require('chalk')
const { version } = require('../package.json')

const major = inc(version, 'major')
const minor = inc(version, 'minor')
const patch = inc(version, 'patch')

prompt([
  {
    type: 'list',
    message: '选择要发布的版本号',
    name: 'releaseVersion',
    choices: [
      {
        name: '主版本: V ' + version + ' => V ' + major,
        value: major,
      },
      {
        name: '次版本: V ' + version + ' => V ' + minor,
        value: minor,
      },
      {
        name: '补丁版本: V ' + version + ' => V ' + patch,
        value: patch,
      },
    ],
  },
]).then(({ releaseVersion }) => {
  echo(yellow('修改版本号 😁'))
  exec('npm version ' + releaseVersion + ' --no-git-tag-version')
  echo('')

  echo(yellow('Changelog 😁'))
  exec('npm run changelog')
  echo('')

  echo(yellow('提交代码 😁'))
  exec('git add . && git commit -m "release: V "' + releaseVersion + ' && git push origin HEAD')
  echo('')

  echo(yellow('设置 Tag 😁'))
  exec('git tag V' + releaseVersion + ' && git -c credential.helper= push origin --progress V' + releaseVersion)
  echo('')

  echo(yellow('发布 npm 😁'))
  exec('npm run build && npm publish --access public')

  echo(green('大功告成 🧨🧨🧨🧨🧨'))
})
