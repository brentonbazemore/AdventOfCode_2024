import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const height = data.length;
const width = data[0].length;
const start = { x: 0, y: 0 };
const end = { x: 0, y: 0 };
const obstacles = new Set<string>();
for (let y = 0; y < data.length; y++) {
  for (let x = 0; x < data[0].length; x++) {
    if (data[y][x] === 'S') {
      start.x = x;
      start.y = y;
    }

    if (data[y][x] === 'E') {
      end.x = x;
      end.y = y;
    }

    if (data[y][x] === '#') {
      obstacles.add(`${x}_${y}`);
    }
  }
}

const hash = (obj: { x: number; y: number }) => `${obj.x}_${obj.y}`;

// bfs
const search = (target: { x: number; y: number }, exempt: string) => {
  const queue = [[start, 0] as [{ x: number; y: number }, number]]; // 1. Initialize queue with Node and current distance 0
  const seen = new Set([hash(start)]); // 2. Initialize set

  for (const [current, distance] of queue) {
    // 3. Loop until the queue is empty
    if (current.x === target.x && current.y === target.y) {
      return distance; // 4. Check dequeued is solution
    }

    for (const neighbor of getNeighbors(current, exempt)) {
      // 5. Get next possible moves (neighbor nodes)
      if (seen.has(hash(neighbor))) {
        continue; // 6. Skip seen nodes
      }
      seen.add(hash(neighbor)); // 7. Mark next node as seen.
      queue.push([neighbor, distance + 1]); // 8. Add neighbor to queue and increase the distance.
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
const getNeighbors = (node: { x: number; y: number }, exempt: string) => {
  const neighbors: { x: number; y: number }[] = [];

  (['up', 'down', 'left', 'right'] as const).forEach(direction => {
    const forward = move[direction](node.x, node.y);
    if (forward.x >= 0 && forward.x <= width && forward.y >= 0 && forward.y <= height) {
      if (exempt === hash(forward) || !obstacles.has(hash(forward))) {
        neighbors.push(forward);
      }
    }
  });

  return neighbors;
};

const savings = new Map<number, number>();
const baseline = search(end, 'none');
obstacles.forEach(obstacle => {
  // console.log(obstacle);
  const cheat = search(end, obstacle);
  const diff = baseline - cheat;
  savings.set(diff, (savings.get(diff) ?? 0) + 1);
});

// console.log(baseline);
// console.log(savings);
let sum = 0;
savings.forEach((count, amount) => {
  if (amount >= 100) {
    sum += count;
  }
});

console.log(sum);