
## Accounts

This is a Rust wrapper for creating accounts and transactions to be converted into WASM.

### To Compile WASM

```
yarn build
```

This will generate `web` and `nodejs` folders that you can import in package.json files elsewhere in the repository with the following (choose either as appropriate):

```
  "dependencies": {
    "stronghold-wasm-web": "*",
    "stronghold-wasm-nodejs": "*"
  },
```
