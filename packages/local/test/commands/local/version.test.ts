import {expect, test} from '@oclif/test'

import * as foreman from '../../../src/fork-foreman'

describe('local:version', () => {
  test
  .stub(foreman, 'fork', function () {
    // eslint-disable-next-line prefer-rest-params
    const argv = arguments[0]
    expect(argv).is.eql(['--version'])
  })
  .command(['local:version'])
  .it('is passes the --version flag to foreman')

  test
  .command(['local:version', 'extra'])
  .catch(error => expect(error.message).to.equal('Unexpected argument: extra\nSee more help with --help'))
  .it('is throws an error when extra arguments are passed in')
})
