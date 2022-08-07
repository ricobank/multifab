# SPDX-License-Identifier: AGPL-3.0

name: public(String[32])
last: public(String[64])
year: public(uint256)

@external
def __init__(name: String[32], last: String[32], year: uint256):
    self.name = name
    self.last = last
    self.year = year
