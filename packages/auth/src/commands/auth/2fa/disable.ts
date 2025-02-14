import {Command} from '@heroku-cli/command'
import {CliUx} from '@oclif/core'

export default class Auth2faGenerate extends Command {
  static description = 'disables 2fa on account'

  static example = '$ heroku auth:2fa:disable'

  static aliases = [
    'twofactor:disable',
    '2fa:disable',
  ]

  async run() {
    CliUx.ux.error('this command has been removed, in favor of disabling MFA in your Account Settings in a browser: https://dashboard.heroku.com/account')
    CliUx.ux.exit(1)
  }
}
