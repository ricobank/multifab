// SPDX-License-Identifier: MIT

const { send } = require('minihat')
const ethers = require('ethers')
const TestHarness = require('./test-harness')

TestHarness.test('fab from blueprint and contract gets correct constructor args', async (harness, assert) => {
    const name = 0x12345678
    const args = ethers.utils.arrayify(name)
    const receipt = await send(harness.multifab.carve, harness.person_bytes_blueprint.address, args)
    const [, , instance, ] = receipt.events.find(event => event.event === 'Built').args
    const person_bytes1 = new ethers.Contract(instance, harness.pb_abi, harness.signer)
    const res_name = await person_bytes1.name()
    assert.equal(res_name, name)
})
