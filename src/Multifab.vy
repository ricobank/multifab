# SPDX-License-Identifier: MIT

event Built:
    user: indexed(address)
    blueprint: indexed(address)
    instance: indexed(address)
    args: Bytes[1024]

names: public(HashMap[bytes32, address])

@internal
def build(blueprint: address, args: Bytes[1024]) -> address:
    instance: address = create_from_blueprint(blueprint, args, code_offset=3)  # , raw_args=True)
    log Built(msg.sender, blueprint, instance, args)
    return instance

@external
def carve(blueprint: address, args: Bytes[1024]) -> address:
    return self.build(blueprint, args)

@external
def stamp(name: bytes32, spot: address):
    assert self.names[name] == empty(address), "assigned"
    self.names[name] = spot

@external
def model(name: bytes32, args: Bytes[1024]) -> address:
    blueprint: address = self.names[name]
    return self.build(blueprint, args)
