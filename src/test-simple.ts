import cghd from './index';

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