// SPDX-License-Identifier: MIT

const { send } = require('minihat')
const ethers = require('ethers')
const TestHarness = require('./test-harness')

TestHarness.test('fab from blueprint and contract gets correct constructor args', async (harness, assert) => {
    const name = 0x12345678
    const args = ethers.utils.arrayify(name)
    const receipt = await send(harness.multifab.build, harness.pb_blueprint.address, args)
    const [, , instance, ] = receipt.events.find(event => event.event === 'Built').args
    const person_bytes1 = new ethers.Contract(instance, harness.pb_contract.abi, harness.signer)
    const res_name = await person_bytes1.name()
    assert.equal(res_name, name)
})

TestHarness.test('verify blueprint code matches original', async (harness, assert) => {
    const blueprint_code = await harness.provider.getCode(harness.pb_blueprint.address)
    const original = harness.pb_contract.evm.bytecode.object
    const preamble = "0xfe7100"
    assert.equal(preamble + original.slice(2), blueprint_code)
})
