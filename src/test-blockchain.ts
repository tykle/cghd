import { createHash } from 'crypto';
import cghd from './index';

// Let assume a blockchain B and a group constant G (room). 
// We want to gather within this group G people selected S 
// according to a deterministic rule in a group of MAX(S) 
// people. We also want the next topology of the group to 
// be unpredictable.

var lastBlock: Buffer = Buffer.from('');
var lastDate: Date = new Date();

function blockchain(): ReturnType<typeof setTimeout> {
  const data: Date = new Date();
  // will change every minute
  data.setSeconds(0);
  data.setMilliseconds(0);

  // mine a sort of heartbeat
  if (data.getTime() === lastDate.getTime()) return setTimeout(blockchain, 500);

  // build a block
  const c = createHash('sha256');
  c.update(lastBlock);
  c.update(data.toString());

  // save last info
  lastBlock = c.digest();
  lastDate = data;

  console.log(`New block ${lastBlock.toString('hex')} at ${data.toString()}`);

  return setTimeout(blockchain, 500);
}

// start the fake block chain
blockchain();

// Consider a group of 100 machines that must select 5 
// machines that will be in charge of monitoring the 
// other 95. The machines share a piece of information, 
// the last block of the blockchain. We create a time 
// lag in order to verify that the assignments work

var machines: bigint = BigInt(0);

function machine(id: bigint, lastBuffer?: string): ReturnType<typeof setTimeout> {
  const timer = 2000 + Math.ceil(Math.random() * 1000);
  const texts: string[] = [];

  const doRoom = (room: string) => {
    // the machines will look for those who are part of 
    // the group (room = serversMonitoring) respecting 
    // the last block of the blockchain.
    const result = cghd(room, 5, machines, lastBlock);
    if (result.indexOf(id) <= -1) return;

    texts.push(`- ${room} ${result.join('-')} ${result.indexOf(id)}`);
  };

  doRoom('specialRoom');
  doRoom('serversMonitoring');

  if (texts.length > 0) {
    const buffer = '\t' + texts.join('\n\t');
    if (buffer === lastBuffer) return setTimeout(machine, timer, id, lastBuffer);

    console.log(`Node #${id}`);
    console.log(buffer);
    lastBuffer = buffer;
  }
  return setTimeout(machine, timer, id, lastBuffer);
}

for (; machines < 100; machines++) machine(machines);
