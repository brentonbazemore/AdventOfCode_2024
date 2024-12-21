const generateManhattanPoints = (x: number, y: number, r: number) => {
  const points: { x: number; y: number; distance: number }[] = [];
  for (let i = 0; i < r; i++) {
    const offset = i;
    const invOffset = r - offset; // Inverse offset
    points.push({ x: x + offset, y: y + invOffset, distance: r });
    points.push({ x: x + invOffset, y: y - offset, distance: r });
    points.push({ x: x - offset, y: y - invOffset, distance: r });
    points.push({ x: x - invOffset, y: y + offset, distance: r });
  }

  return points;
};

addEventListener('message', (event: MessageEvent<{ tiles: string[]; obstacles: Set<string>; width: number; height: number; baseline: number, start: { x: number, y: number }, end: { x: number, y: number, distance: number } }>) => {
  // console.log('Message from main thread:', event.data);
  const { tiles, obstacles, width, height, baseline, start, end } = event.data;
  const hash = (obj: { x: number; y: number }) => `${obj.x}_${obj.y}`;

  // bfs
  const search = (
    target: { x: number; y: number },
    jump: { start: { x: number; y: number }; end: { x: number; y: number; distance: number } },
    limit = Infinity
  ) => {
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
  const getNeighbors = (node: { x: number; y: number }, jump: { start: { x: number; y: number }; end: { x: number; y: number; distance: number } }) => {
    const neighbors: { x: number; y: number; distance: number }[] = [];
    if (hash(node) === hash(jump.start)) {
      neighbors.push(jump.end);
    }

    (['up', 'down', 'left', 'right'] as const).forEach((direction) => {
      const forward = move[direction](node.x, node.y);
      if (forward.x >= 0 && forward.x <= width && forward.y >= 0 && forward.y <= height) {
        if (!obstacles.has(hash(forward))) {
          neighbors.push({ ...forward, distance: 1 });
        }
      }
    });

    return neighbors;
  };

  const limit = baseline - 100;
  const savings = new Map<number, number>();
  let j = 0;
  tiles.forEach((tile) => {
    console.log(tile, j);
    const [x, y] = tile.split('_').map(Number);
    for (let i = 1; i <= 20; i++) {
      const jumpEnds = generateManhattanPoints(x, y, i);
      jumpEnds.forEach((jumpEnd) => {
        if (!obstacles.has(hash(jumpEnd)) && jumpEnd.x >= 0 && jumpEnd.x <= width && jumpEnd.y >= 0 && jumpEnd.y <= height) {
          const jump = { start: { x, y }, end: jumpEnd };
          const cheat = search(end, jump, limit);
          if (cheat !== -1) {
            const diff = baseline - cheat;
            savings.set(diff, (savings.get(diff) ?? 0) + 1);
          }
        }
      });
    }
    j++;
  });

  postMessage(savings); // return output
});
