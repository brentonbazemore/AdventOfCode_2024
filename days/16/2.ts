import '../../types/helper.d.ts';
import Graph from 'node-dijkstra';
type PathResult = {
  path: string[];
  cost: number;
}

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const move = {
  north: (x: number, y: number) => ({ x, y: y - 1, direction: 'north' as Direction, cost: 1 }),
  south: (x: number, y: number) => ({ x, y: y + 1, direction: 'south' as Direction, cost: 1 }),
  east: (x: number, y: number) => ({ x: x + 1, y, direction: 'east' as Direction, cost: 1 }),
  west: (x: number, y: number) => ({ x: x - 1, y, direction: 'west' as Direction, cost: 1 }),
};
const turn: { [key: string]: Direction[] } = {
  north: ['west', 'east'],
  south: ['west', 'east'],
  east: ['north', 'south'],
  west: ['north', 'south'],
};
const getNeighbors = (node: { x: number; y: number; direction: Direction }) => {
  const neighbors: { x: number; y: number; direction: Direction; cost: number }[] = [];
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

const graph = new Graph();

type Direction = 'north' | 'south' | 'east' | 'west';
const directions: Direction[] = ['north', 'south', 'east', 'west'];
let start = null;
let endN = null;
let endE = null;
let endS = null;
let endW = null;
for (let y = 0; y < data.length; y++) {
  for (let x = 0; x < data[0].length; x++) {
    if (data[y][x] !== '#') {
      directions.forEach((direction) => {
        const src = `${x}_${y}_${direction}`;

        const neighborList = getNeighbors({ x, y, direction });
        const neighbors: { [key: string]: number } = {};
        neighborList.forEach((neighbor) => {
          const dest = `${neighbor.x}_${neighbor.y}_${neighbor.direction}`;
          neighbors[dest] = neighbor.cost;
        });
        graph.addNode(src, neighbors);
      });
    }

    if (data[y][x] === 'S') {
      start = `${x}_${y}_east`;
    }

    if (data[y][x] === 'E') {
      endN = `${x}_${y}_north`;
      endE = `${x}_${y}_east`;
      endS = `${x}_${y}_south`;
      endW = `${x}_${y}_west`;
    }
  }
}

const unique = new Set();
const { path: bestPath, cost: bestCost } = graph.path(start, endN, { cost: true }) as PathResult;
bestPath.forEach(pos => {
  const [x, y] = pos.split('_');
  unique.add(`${x}_${y}`);
});

bestPath.forEach((pos, i) => {
  console.log('checking', i, 'out of', bestPath.length)
  if (start === pos) {
    return; 
  }

  if (endN === pos) {
    return;
  }

  const { cost, path } = graph.path(start, endN, { cost: true, avoid: [pos]}) as PathResult;
  if (cost === bestCost) {
    path.forEach(pos => {
      const [x, y] = pos.split('_');
      unique.add(`${x}_${y}`);
    });
  }
});
console.log(unique.size);

// 7036
// 91464
