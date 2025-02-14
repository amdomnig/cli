import color from '@heroku-cli/color'
import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {CliUx, Interfaces} from '@oclif/core'

const SecurityExceptionFeatures: any = {
  'spaces-strict-tls': {
    async prompt(app: string): Promise<string> {
      CliUx.ux.warn('Insecure Action')
      const name = await CliUx.ux.prompt(`You are enabling an older security protocol, TLS 1.0, which some organizations may not deem secure.
To proceed, type ${app} or re-run this command with --confirm ${app}`)
      return name
    },
  },
}

export default class LabsDisable extends Command {
  static description = 'disables an experimental feature'

  static args = [{name: 'feature'}]

  static flags: Interfaces.FlagInput = {
    app: flags.app(),
    remote: flags.remote(),
    confirm: flags.string({required: false}),
  }

  async run() {
    const {args, flags} = await this.parse(LabsDisable)
    const feature = args.feature
    let request
    let target

    if (SecurityExceptionFeatures[feature]) {
      if (flags.confirm !== flags.app) {
        const prompt = SecurityExceptionFeatures[feature].prompt
        const confirm = await prompt(flags.app)
        if (confirm !== flags.app) {
          this.error('Confirmation name did not match app name. Try again.')
        }
      }
    }

    try {
      await this.heroku.get(`/account/features/${feature}`)
      request = this.disableFeature(feature)
      target = (await this.heroku.get<Heroku.Account>('/account')).body.email
    } catch (error: any) {
      if (error.http.statusCode !== 404) throw error
      // might be an app feature
      if (!flags.app) throw error
      await this.heroku.get<Heroku.AppFeature>(`/apps/${flags.app}/features/${feature}`)
      request = this.disableFeature(feature, flags.app)
      target = flags.app
    }

    CliUx.ux.action.start(`Disabling ${color.green(feature)} for ${color.cyan(target!)}`)
    await request
    CliUx.ux.action.stop()
  }

  disableFeature(feature: string, app?: string): Promise<any> {
    return this.heroku.patch(app ? `/apps/${app}/features/${feature}` : `/account/features/${feature}`, {
      body: {enabled: false},
    })
  }
}
