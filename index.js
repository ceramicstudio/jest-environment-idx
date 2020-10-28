const { publishIDXConfig } = require('@ceramicstudio/idx-tools')
const Wallet = require('identity-wallet').default
const CeramicEnvironment = require('jest-environment-ceramic')
const fromString = require('uint8arrays/from-string')

module.exports = class IDXEnvironment extends CeramicEnvironment {
  constructor(config, context) {
    super(config, context)
    this.seed = fromString(
      config.seed || '0000000000000000000000000000000000000000000000000000000000000000'
    )
  }

  async setup() {
    await super.setup()
    await publishIDXConfig(this.global.ceramic)
    this.global.wallet = await Wallet.create({
      ceramic: this.global.ceramic,
      seed: this.seed,
      getPermission: () => Promise.resolve([]),
    })
    await this.global.ceramic.setDIDProvider(this.global.wallet.getDidProvider())
  }
}
