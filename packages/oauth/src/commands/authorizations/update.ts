import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {CliUx} from '@oclif/core'

import {display} from '../../lib/authorizations'

export default class AuthorizationsUpdate extends Command {
  static description = 'updates an OAuth authorization'

  static flags = {
    description: flags.string({char: 'd', description: 'set a custom authorization description'}),
    'client-id': flags.string({description: 'identifier of OAuth client to set', dependsOn: ['client-secret']}),
    'client-secret': flags.string({description: 'secret of OAuth client to set', dependsOn: ['client-id']}),
  }

  static args = [{name: 'id', required: true}]

  async run() {
    const {args, flags} = await this.parse(AuthorizationsUpdate)

    CliUx.ux.action.start('Updating OAuth Authorization')

    let client
    if (flags['client-id']) {
      client = {
        id: flags['client-id'],
        secret: flags['client-secret'],
      }
    }

    const {body: authentication} = await this.heroku.patch<Heroku.OAuthAuthorization>(
      `/oauth/authorizations/${args.id}`,
      {
        body: {
          description: flags.description,
          client,
        },
      },
    )

    CliUx.ux.action.stop()

    display(authentication)
  }
}
