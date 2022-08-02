// See https://eips.ethereum.org/EIPS/eip-5202 for an explanation of constants used and blueprint structure
// And for a python implementation https://github.com/vyperlang/titanoboa/blob/ef5d2d2712c2d2f20acc8044e699625016af30e5/boa/contract.py#L120

module.exports = blueprint = {}

const preamble    = "fe7100"
const deploy_pre  = "0x61"
const deploy_post = "3d81600a3d39f3"

blueprint.generate = (code) => {
    const blueprint_code = preamble + code.slice(2)
    const len_bytes = blueprint_code.length / 2
    const len_str = len_bytes.toString(16).padStart(4, "0")
    return deploy_pre + len_str + deploy_post + blueprint_code
}
