// SPDX-License-Identifier: MIT

const path = require('path')

const ethers = require('ethers')
const tapzero = require('tapzero')
const testHarness = require('tapzero/harness')

const network = require("../utils/network")
const blueprint = require("../utils/blueprint")

const vars = {raw: true}

class TestHarness {
    async bootstrap() {
        if (vars.raw) {
            network.start()
            vars.dir = path.join(__dirname, "../out")
            const provider = new ethers.providers.JsonRpcProvider()
            vars.signer = provider.getSigner()
            const src_output = require(`${vars.dir}/SrcOutput.json`)

            const mf_contract = src_output.contracts["src/Multifab.vy"].Multifab
            const mf_factory = new ethers.ContractFactory(
                mf_contract.abi, mf_contract.evm.bytecode.object, vars.signer)

            const pers_contract = src_output.contracts["src/test/Person.vy"].Person
            const pers_factory = new ethers.ContractFactory(
                pers_contract.abi, blueprint.generate(pers_contract.evm.bytecode.object), vars.signer)

            await network.ready()
            vars.multifab = await mf_factory.deploy()
            vars.pers_blueprint = await pers_factory.deploy(Buffer.from(""), Buffer.from(""), 0)
            vars.pers_contract = pers_contract
            vars.provider = provider
            vars.raw = false
        }
        Object.assign(this, vars)
    }

    async close() {
        setTimeout(() => {
            if (tapzero.GLOBAL_TEST_RUNNER.completed) {
                network.exit()
            }
        }, 0)
    }
}

TestHarness.test = testHarness(tapzero, TestHarness)
module.exports = TestHarness
