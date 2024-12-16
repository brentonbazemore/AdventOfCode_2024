import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

type Direction = 'north' | 'south' | 'east' | 'west';
const start = { x: 0, y: 0, direction: 'east' as Direction };
const end = { x: 0, y: 0 };
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
  }
}

const hash = (obj: { x: number, y: number, direction: Direction }) => {
  return `${obj.x}_${obj.y}_${obj.direction}`;
}

// bfs + sorting
const search = (target: { x: number; y: number }) => {
  const queue = [[start, 0] as [{ x: number; y: number; direction: Direction }, number]]; // 1. Initialize queue with Node and current distance 0
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
      queue.push([neighbor, distance + neighbor.cost]); // 8. Add neighbor to queue and increase the distance.
    }

    queue.sort((a, b) => a[1] - b[1]); // lazy dijkstra
  }

  return -1; // 9. If you didn't find the answer, return something like -1/null/undefined.
};

const move = {
  north: (x: number, y: number) => ({x, y: y - 1, direction: 'north' as Direction, cost: 1 }),
  south: (x: number, y: number) => ({x, y: y + 1, direction: 'south' as Direction, cost: 1 }),
  east: (x: number, y: number) => ({x: x + 1, y, direction: 'east' as Direction, cost: 1 }),
  west: (x: number, y: number) => ({x: x - 1, y, direction: 'west' as Direction, cost: 1 }),
};
const turn: {[key: string]: Direction[] } = {
  north: ['west', 'east'],
  south: ['west', 'east'],
  east: ['north', 'south'],
  west: ['north', 'south'],
};
const getNeighbors = (node: { x: number; y: number; direction: Direction }) => {
  const neighbors: { x: number, y: number, direction: Direction, cost: number }[] = [];
  const directions = turn[node.direction];

  const forward = move[node.direction](node.x, node.y);
  if (data[forward.y][forward.x] !== '#') {
    neighbors.push(forward);
  }

  directions.forEach((direction) => {
    neighbors.push({ ...node, direction, cost: 1000 });
  });

  return neighbors;
};

const out = search(end);
console.log(out);
