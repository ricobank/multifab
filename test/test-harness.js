// SPDX-License-Identifier: MIT

const path = require('path')

const ethers = require('ethers')
const tapzero = require('tapzero')
const testHarness = require('tapzero/harness')

const network = require("../utils/network")

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

            const pb_contract = src_output.contracts["src/test/PersonBytes.vy"].PersonBytes
            const pb_factory = new ethers.ContractFactory(
                pb_contract.abi, this.add_preamble(pb_contract.evm.bytecode.object), vars.signer)

            await network.ready()
            vars.multifab = await mf_factory.deploy()
            vars.person_bytes_blueprint = await pb_factory.deploy([])
            vars.pb_abi = pb_contract.abi
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

    add_preamble(bytecode) {
        const blueprint_preamble = "fe7100"
        const blueprint_bytecode = "0x" + blueprint_preamble + bytecode.slice(2)
        const len_bytes = (blueprint_bytecode.length - 2) / 2
        const deploy_bytecode = "0x61" + len_bytes.toString(16).padStart(4, "0") + "3d81600a3d39f3"
        return deploy_bytecode + blueprint_bytecode.slice(2)
    }
}

TestHarness.test = testHarness(tapzero, TestHarness)
module.exports = TestHarness
