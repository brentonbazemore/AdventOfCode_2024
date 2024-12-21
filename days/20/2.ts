import '../../types/helper.d.ts';
import os from 'node:os';
import * as _ from 'lodash';
const THREAD_COUNT = os.cpus().length; // only make as many threads as the hardware can handle

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const height = data.length;
const width = data[0].length;
const start = { x: 0, y: 0 };
const end = { x: 0, y: 0 };
const obstacles = new Set<string>();
const tiles = new Set<string>();
for (let y = 0; y < data.length; y++) {
  for (let x = 0; x < data[0].length; x++) {
    if (data[y][x] === 'S') {
      start.x = x;
      start.y = y;
      tiles.add(`${x}_${y}`);
    }

    if (data[y][x] === 'E') {
      end.x = x;
      end.y = y;
      tiles.add(`${x}_${y}`);
    }

    if (data[y][x] === '#') {
      obstacles.add(`${x}_${y}`);
    }

    if (data[y][x] === '.') {
      tiles.add(`${x}_${y}`);
    }
  }
}

const hash = (obj: { x: number; y: number }) => `${obj.x}_${obj.y}`;

// bfs
const search = (target: { x: number; y: number }, jump: { start: { x: number; y: number }, end: { x: number; y: number, distance: number }}, limit = Infinity) => {
  const queue = [[start, 0] as [{ x: number; y: number }, number]]; // 1. Initialize queue with Node and current distance 0
  const seen = new Set([hash(start)]); // 2. Initialize set

  for (const [current, distance] of queue) {
    // 3. Loop until the queue is empty
    if (current.x === target.x && current.y === target.y) {
      return distance; // 4. Check dequeued is solution
    }

    for (const neighbor of getNeighbors(current, jump)) {
      // 5. Get next possible moves (neighbor nodes)
      if (seen.has(hash(neighbor))) {
        continue; // 6. Skip seen nodes
      }

      if (distance > limit) {
        continue;
      }

      seen.add(hash(neighbor)); // 7. Mark next node as seen.
      queue.push([neighbor, distance + neighbor.distance]); // 8. Add neighbor to queue and increase the distance.
    }
  }

  return -1; // 9. If you didn't find the answer, return something like -1/null/undefined.
};

const move = {
  up: (x: number, y: number) => ({ x, y: y - 1 }),
  down: (x: number, y: number) => ({ x, y: y + 1 }),
  right: (x: number, y: number) => ({ x: x + 1, y }),
  left: (x: number, y: number) => ({ x: x - 1, y }),
};
const getNeighbors = (node: { x: number; y: number }, jump: { start: { x: number; y: number }, end: { x: number; y: number, distance: number } }) => {
  const neighbors: { x: number; y: number, distance: number }[] = [];
  if (hash(node) === hash(jump.start)) {
    neighbors.push(jump.end);
  }

  (['up', 'down', 'left', 'right'] as const).forEach(direction => {
    const forward = move[direction](node.x, node.y);
    if (forward.x >= 0 && forward.x <= width && forward.y >= 0 && forward.y <= height) {
      if (!obstacles.has(hash(forward))) {
        neighbors.push({ ...forward, distance: 1 });
      }
    }
  });

  return neighbors;
};

const savings = new Map<number, number>();
const baseline = search(end, { start: { x: -100, y: -100 }, end: { x: -100, y: -100, distance: Infinity }});
console.log(tiles.size);

const workerURL = new URL("worker.ts", import.meta.url).href;
const workers: Promise<Map<number, number>>[] = [];


const chunks = _.chunk([...tiles], Math.ceil(tiles.size / THREAD_COUNT));
chunks.forEach(chunk => {
  const worker = new Worker(workerURL);
  console.log('sending', chunk.length)
  workers.push(new Promise((res, rej) => {
    worker.addEventListener("message", (event: MessageEvent) => { // receive output from thread
      res(event.data); // let Promise.all know when the thread finished
      worker.terminate(); // kill thread
    });
  }));

  // <{ tiles: string[]; obstacles: Set<string>; width: number; height: number; baseline: number, start: { x: number, y: number }, end: { x: number, y: number, distance: number } }>
  worker.postMessage({ tiles: chunk, obstacles, width, height, baseline, start, end }); // send chunk of data to thread
});

Promise.all(workers).then((threadOutputs) => {
  let sum = 0;
  for (let i = 0; i < threadOutputs.length; i++) {
    threadOutputs[i].forEach((count, amount) => {
      if (amount >= 100) {
        console.log(amount, 'had', count);
        sum += count;
      }
    });
  }
  console.log(sum);
});

// console.log(baseline);
// console.log(savings);
// let sum = 0;
// savings.forEach((count, amount) => {
//   if (amount >= 100) {
//     // console.log(amount, 'had', count);
//     sum += count;
//   }
// });

// console.log(sum);