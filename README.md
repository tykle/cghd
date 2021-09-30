# Cyclic Group Hashing Distribution CGHD-256
Support for TypeScript / Javascript

```bash
npm install cghd --save
```

## Context

Let assume a blockchain B and a group constant G (room). We want to gather within this group G people selected S according to a deterministic rule in a group of MAX(S) people. We also want the next topology of the group to be unpredictable.

Consider a group of 100 machines that must select 5 machines that will be in charge of monitoring the other 95. The machines share a piece of information, the last block of the blockchain. We create a time lag in order to verify that the assignments work

## Examples

Example using Javascript:

```js
const cghd = require("cghd").default;

const blockchain = Buffer.from("0x7b298fb321a42d4eca960d17aa2461545ffebfa3480c697374096e56cbfad090")

// a set of machines
const machines = 100;

console.log("Create a room0 with 5 nodes", cghd("room0", 5, machines, blockchain))
console.log("Room name affects the result", cghd("room1", 5, machines, blockchain))
console.log("Number of required node affects the result", cghd("room0", 4, machines, blockchain))
console.log("Number of set affects the result", cghd("room0", 4, machines-1, blockchain))
console.log("Complexity increase the computation time and affects the result", cghd("room0", 5, machines, blockchain, 100000))

const stats = {collisions: 0}
const ret0 = cghd("room0", 75, machines, blockchain, 10, stats);
console.log(`Too much selected node creates collisions=${stats.collisions}`, ret0)
```

Should return

```
Create a room0 with 5 nodes [ 40n, 93n, 58n, 15n, 3n ]
Room name affects the result [ 79n, 49n, 31n, 1n, 25n ]
Number of required node affects the result [ 8n, 57n, 53n, 2n ]
Number of set affects the result [ 64n, 94n, 60n, 44n ]
Complexity increase the computation time and affects the result [ 45n, 84n, 10n, 3n, 77n ]
Too much selected node creates collisions=39 [
  76n, 10n, 21n, 35n, 64n, 95n, 52n, 45n, 32n, 58n, 89n,
  12n, 54n, 72n,  7n, 23n, 44n, 78n, 17n, 94n, 75n, 30n,
  85n, 63n, 31n, 38n, 61n, 39n, 40n, 69n,  5n, 80n,  4n,
  15n, 18n, 86n, 27n,  9n, 33n, 36n, 77n, 56n, 96n, 41n,
  73n,  2n, 48n,  3n, 91n, 11n, 53n, 65n,  8n, 46n, 13n,
   0n, 70n, 14n, 55n, 60n, 88n,  6n, 99n, 29n, 34n, 90n,
  71n, 51n, 57n, 68n, 67n, 16n, 84n, 20n, 79n
]
```