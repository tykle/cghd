import { createHash } from 'crypto';

// Cyclic Group Hashing Distribution CGHD-256

interface StatsType {
  collisions: number;
}

function cghd(
  data: string | Buffer,
  position: number | bigint,
  max: number | bigint,
  root?: string | Buffer,
  complexity?: number,
  stats?: null | StatsType,
): bigint[] {
  if (position > max) return [];

  const ret: bigint[] = [];
  const shiftBuf: Buffer = Buffer.from(data);

  if (!root) root = Buffer.from('');
  if (!complexity || complexity <= 0) complexity = 10;
  if (!stats) stats = { collisions: 0 };
  if (!stats.collisions) stats.collisions = 0;

  function digest(dataToEat: string | Buffer): Buffer {
    const c = createHash('sha256');
    c.update(dataToEat);
    return c.digest();
  }

  // digest the current shift buffer to the root
  // block in order to preserve the serie consistency
  // prepapre lane
  const lane = `${root}/${shiftBuf}/${complexity}/${position}/${max}`;
  var complexityBlock = digest(lane);

  // console.log("complexityBlock1", complexityBlock.toString("hex"), lane.toString())

  // loop the complexity chain
  for (var a = 0; a < complexity; a++) {
    // here we just add the last block + 32 bits counter
    const tmp = Buffer.alloc(complexityBlock.byteLength + 4);
    complexityBlock.copy(tmp);

    // 32 bits integer is added at each loop
    tmp.writeInt32LE(a, complexityBlock.byteLength);

    // digest & swap the current block
    complexityBlock = digest(tmp);

    // console.log("complexityBloc2", complexityBlock.toString("hex"), tmp.toString("hex"))
  }

  // retrieve position in the space
  for (var a = 0; a < position; a++) {
    // Concat lastBlock+shiftBuffer+32 bits
    const tmp = Buffer.alloc(shiftBuf.byteLength + complexityBlock.byteLength + 4);
    var cur = 0;

    complexityBlock.copy(tmp, cur);
    cur += complexityBlock.byteLength;
    shiftBuf.copy(tmp, cur);
    cur += shiftBuf.byteLength;

    // 32 bits integer is added at each loop
    tmp.writeInt32LE(a, cur);
    cur += 4;

    // digest the next block
    const nextComplexityBlock = digest(tmp);

    // convert hash to big int
    const brc = BigInt(`0x${nextComplexityBlock.toString('hex')}`);

    // retrieve modulo
    const result = brc % BigInt(max);

    // verify positions from the queue
    var found = false;
    for (const item of ret) {
      if (item === result) {
        found = true;
        break;
      }
    }

    // check if position is found in the tab
    // retry a block
    if (found === true) {
      stats.collisions++;
      a--;
    } else {
      // push a result
      ret.push(brc % BigInt(max));
    }

    // install the next block
    complexityBlock = nextComplexityBlock;

    // console.log("complexityBloc3", complexityBlock.toString("hex"), tmp.toString("hex"), brc)
  }

  return ret;
}

export default cghd;
