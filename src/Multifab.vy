# SPDX-License-Identifier: MIT

event Built:
    user:      indexed(address)
    blueprint: indexed(address)
    instance:  indexed(address)
    args:      Bytes[4096]

@external
def build(blueprint: address, args: Bytes[4096]) -> address:
    instance: address = create_from_blueprint(blueprint, args, raw_args=True, code_offset=3)
    log Built(msg.sender, blueprint, instance, args)
    return instance
