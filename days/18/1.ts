import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const size = inputFile === 'input.txt' ? 70 : 6;
const bytes = inputFile === 'input.txt' ? 1024 : 12;
const end = inputFile === 'input.txt' ? { x: 70, y: 70 } : { x: 6, y: 6 };

const obstacles = new Set<string>();
for (let i = 0; i < bytes; i++) {
  const [x, y] = data[i].split(',');
  obstacles.add(`${x}_${y}`);
}

const hash = (obj: { x: number; y: number }) => `${obj.x}_${obj.y}`;
const start = { x: 0, y: 0 };

// bfs + sorting
const search = (target: { x: number; y: number }) => {
  const queue = [[start, 0] as [{ x: number; y: number }, number]]; // 1. Initialize queue with Node and current distance 0
  const seen = new Set([hash(start)]); // 2. Initialize set

  for (const [current, distance] of queue) {
    // 3. Loop until the queue is empty
    if (current.x === target.x && current.y === target.y) {
      return distance; // 4. Check dequeued is solution
    }

    for (const neighbor of getNeighbors(current)) {
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
const getNeighbors = (node: { x: number; y: number }) => {
  const neighbors: { x: number; y: number }[] = [];

  (['up', 'down', 'left', 'right'] as const).forEach(direction => {
    const forward = move[direction](node.x, node.y);
    if (!obstacles.has(hash(forward)) && forward.x >= 0 && forward.x <= size && forward.y >= 0 && forward.y <= size) {
      neighbors.push(forward);
    }
  });

  return neighbors;
};
const out = search(end);
console.log(out);
