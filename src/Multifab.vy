# SPDX-License-Identifier: MIT

event Built:
    user:      indexed(address)
    blueprint: indexed(address)
    instance:  indexed(address)
    args:      Bytes[1024]

@external
def build(blueprint: address, args: Bytes[1024]) -> address:
    instance: address = create_from_blueprint(blueprint, args, code_offset=3)  # , raw_args=True)
    log Built(msg.sender, blueprint, instance, args)
    return instance
