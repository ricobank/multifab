# vyper-multifab

`multifab` is an object that constructs new contracts using vypers create_from_blueprint(). It is inspired by
[an old idea](https://github.com/nexusdev/the-factory). Deployed blueprints contain the initcode of the original
contract, when new instances are created the constructor is called and its arguments can be provided. The blueprint
is loaded from already deployed data so new instances are created relatively cheaply by loading data with EXTCODECOPY.

### usage

multifab has a single function

```
@external
def build(blueprint: address, args: Bytes[1024]) -> address:
```

Call `build` with the address of a blueprint and the constructor arguments, get back the address of a new instance of
that contract built with those constructor arguments.

### creating blueprints

To create blueprints you deploy bytecode in the format of [EIP-5202](EIP-5202: Blueprint contract format). A
[module](utils/blueprint.js) in this repository can be used to generate bytecode in that format from your compiled
bytecode, usage is demonstrated in tests. Alternatively the vyper compiler can be used like
"vyper -f blueprint_bytecode <foo.vy>" 

You may want to use [dmap](https://dmap.sh/) to share the address of your blueprint.

### verifying
To verify the address passed to build will create a copy of your intended contract you can compare the code at that
address with the result of compiling the intended contract with the same compiler the blueprint was made with. It should
start with 0xfe71XX followed by an exact copy of the compiled bytecode.
