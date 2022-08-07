// SPDX-License-Identifier: MIT

const { send } = require('minihat')
const ethers = require('ethers')
const TestHarness = require('./test-harness')

TestHarness.test('fab from blueprint and contract gets correct constructor args', async (harness, assert) => {
    const name = "dan"
    const last = "eli"
    const year = 12345
    const args = ethers.utils.defaultAbiCoder.encode([ "string", "string", "uint" ], [ name, last, year ])

    const receipt = await send(harness.multifab.build, harness.pers_blueprint.address, args)
    const [, , instance, ] = receipt.events.find(event => event.event === 'Built').args
    const person = new ethers.Contract(instance, harness.pers_contract.abi, harness.signer)

    const res_name = await person.name()
    const res_last = await person.last()
    const res_year = await person.year()

    assert.equal(res_name, name)
    assert.equal(res_last, last)
    assert.equal(res_year, year)
})

TestHarness.test('verify blueprint code matches original', async (harness, assert) => {
    const blueprint_code = await harness.provider.getCode(harness.pers_blueprint.address)
    const original = harness.pers_contract.evm.bytecode.object
    const preamble = "0xfe7100"
    assert.equal(preamble + original.slice(2), blueprint_code)
})
