import {expect, test} from '@oclif/test'

import * as foreman from '../../../src/fork-foreman'

describe('local:run', () => {
  describe('when no arguments are given', function () {
    test
    .command(['local:run'])
    .catch(/Usage: heroku local:run \[COMMAND\]/)
    .it('errors with proper usage suggestion')
  })

  describe('when arguments are given', function () {
    test
    .stub(foreman, 'fork', function () {
      // eslint-disable-next-line prefer-rest-params
      const argv = arguments[0]
      expect(argv).is.eql(['run', '--port', '5001', '--', 'echo', 'hello'])
    })
    .command(['local:run', 'echo', 'hello'])
    .it('can handle one argument passed to foreman after the -- argument separator')

    test
    .stub(foreman, 'fork', function () {
      // eslint-disable-next-line prefer-rest-params
      const argv = arguments[0]
      expect(argv).is.eql(['run', '--port', '5001', '--', 'echo', 'hello', 'world'])
    })
    .command(['local:run', 'echo', 'hello', 'world'])
    .it('can handle multiple argument passed to foreman after the `--` argument separator')
  })

  describe('when the environemnt flag is given', function () {
    test
    .stub(foreman, 'fork', function () {
      // eslint-disable-next-line prefer-rest-params
      const argv = arguments[0]
      expect(argv).is.eql(['run', '--env', 'env-file', '--port', '5001', '--', 'bin/migrate'])
    })
    .command(['local:run', 'bin/migrate', '--env', 'env-file'])
    .it('is passed to foreman an an --env flag before the `--` argument separator')

    test
    .stub(foreman, 'fork', function () {
      // eslint-disable-next-line prefer-rest-params
      const argv = arguments[0]
      expect(argv).is.eql(['run', '--env', 'env-file', '--port', '5001', '--', 'bin/migrate'])
    })
    .command(['local:run', 'bin/migrate', '-e', 'env-file'])
    .it('is can pass the `-e` shorthand to foreman an an --env flag before the `--` argument separator')
  })

  describe('when the port flag is given', function () {
    test
    .stub(foreman, 'fork', function () {
      // eslint-disable-next-line prefer-rest-params
      const argv = arguments[0]
      expect(argv).is.eql(['run', '--port', '4200', '--', 'bin/serve'])
    })
    .command(['local:run', 'bin/serve', '--port', '4200'])
    .it('is passed to foreman an a --port flag before the `--` argument separator')

    test
    .stub(foreman, 'fork', function () {
      // eslint-disable-next-line prefer-rest-params
      const argv = arguments[0]
      expect(argv).is.eql(['run', '--port', '4200', '--', 'bin/serve'])
    })
    .command(['local:run', 'bin/serve', '-p', '4200'])
    .it('is can pass the `-p` shorthand to foreman an a --port flag before the `--` argument separator')
  })
})
