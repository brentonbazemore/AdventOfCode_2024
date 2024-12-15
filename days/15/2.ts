import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const [rawRoom, instructions] = rawData.split('\n\n');
const room = rawRoom.split('\n');

let robot = { x: 0, y: 0 };
const entities = new Map<string, { type: 'wall' | 'leftbox' | 'rightbox' }>();
for (let y = 0; y < room.length; y++) {
  for (let x = 0; x < room[0].length; x++) {
    if (room[y][x] === '#') {
      entities.set(`${x * 2}_${y}`, { type: 'wall' });
      entities.set(`${(x * 2) + 1}_${y}`, { type: 'wall' });
    }

    if (room[y][x] === 'O') {
      entities.set(`${x * 2}_${y}`, { type: 'leftbox' });
      entities.set(`${(x * 2) + 1}_${y}`, { type : 'rightbox' });
    }

    if (room[y][x] === '@') {
      robot = { x: x * 2, y };
    }
  }
}

const scanDir = { up: [0, -1], down: [0, 1], right: [1, 0], left: [-1, 0] };
const scan = (startX: number, startY: number, direction: 'up' | 'down' | 'left' | 'right') => {
  let i = 1;
  while (true) {
    const x = startX + (i * scanDir[direction][0]);
    const y = startY + (i * scanDir[direction][1]);

    if (!entities.has(`${x}_${y}`)) {
      return { x, y };
    }

    if (entities.get(`${x}_${y}`)?.type === 'wall') {
      return null;
    }
    
    i++;
  }
};

const check = (x: number, y: number, direction: 'up' | 'down' | 'left' | 'right') => {
  // console.log('checking');
  const [xDiff, yDiff] = scanDir[direction];
  const [nextX, nextY] = [x + xDiff, y + yDiff];

  const movers: ({ x: number, y: number } | null)[] = [{ x, y }];
  const next = entities.get(`${nextX}_${nextY}`);
  if (!next) {
    return movers;  
  }

  if (next.type === 'wall') {
    return [null];
  }

  if (direction === 'up' || direction === 'down') {
    if (next?.type === 'leftbox') {
      movers.push(...check(nextX, nextY, direction));
      movers.push(...check(nextX + 1, nextY, direction));
    } else if (next?.type === 'rightbox') {
      movers.push(...check(nextX - 1, nextY, direction));
      movers.push(...check(nextX, nextY, direction));
    }
  } else {
    movers.push(...check(nextX, nextY, direction));
  }

  return movers;
}

const scoot = (x: number, y: number, direction: 'up' | 'down' | 'left' | 'right') => {
  const movers = check(x, y, direction);
  // console.log(movers);

  if (movers.some(mover => mover === null)) {
    return false;
  }

  const newPos = new Map();
  const [xDiff, yDiff] = scanDir[direction];
  movers.forEach((moverish) => {
    const mover = moverish!; // literally null checking above
    const [nextX, nextY] = [mover.x + xDiff, mover.y + yDiff];
    newPos.set(`${nextX}_${nextY}`, entities.get(`${mover.x}_${mover.y}`)!)
  });
  movers.forEach((moverish) => {
    const mover = moverish!; // literally null checking above
    entities.delete(`${mover.x}_${mover.y}`)
  });
  newPos.forEach((entity, pos) => entities.set(pos, entity));

  return true;
}

const icon2Dir = {
  '^': 'up',
  'v': 'down',
  '<': 'left',
  '>': 'right',
} as const;


const debug = () => {
  for (let y = 0; y < room.length; y++) {
    let row = '';
    for (let x = 0; x < room[0].length * 2; x++) {
      if (entities.get(`${x}_${y}`)?.type === 'wall') {
        row += '#'
      } else if (entities.get(`${x}_${y}`)?.type === 'leftbox') {
        row += '[';
      } else if (entities.get(`${x}_${y}`)?.type === 'rightbox') {
        row += ']';
      } else if (robot.x === x && robot.y === y) {
        row += '@'
      } else {
        row += '.'
      }
    }
    console.log(row);
  }
}

// console.log(debug());

instructions.split('').forEach((instruction) => {
  // console.log('Move', instruction)
  const direction = icon2Dir[instruction as '^' | 'v' | '<' | '>'];

  if (scoot(robot.x, robot.y, direction)) {
    const next = [robot.x + scanDir[direction][0], robot.y + scanDir[direction][1]];
    robot.x = next[0];
    robot.y = next[1];
  }
  // debug()
});

let sum = 0;
entities.forEach((entity, pos) => {
  if (entity?.type === 'leftbox') {
    const [x, y] = pos.split('_').map(Number);
    sum += (100 * y) + x;
  }
});

console.log(sum);