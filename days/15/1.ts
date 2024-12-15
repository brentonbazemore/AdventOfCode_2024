import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const [rawRoom, instructions] = rawData.split('\n\n');
const room = rawRoom.split('\n');

let robot = { x: 0, y: 0 };
const entities = new Map<string, { type: 'wall' | 'box' }>();
for (let y = 0; y < room.length; y++) {
  for (let x = 0; x < room[0].length; x++) {
    if (room[y][x] === '#') {
      entities.set(`${x}_${y}`, { type: 'wall' });
    }

    if (room[y][x] === 'O') {
      entities.set(`${x}_${y}`, {
        type: 'box',
      });
    }

    if (room[y][x] === '@') {
      robot = { x, y };
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

const scoot = (x: number, y: number, direction: 'up' | 'down' | 'left' | 'right') => {
  const [xDiff, yDiff] = scanDir[direction];
  const [nextX, nextY] = [x + xDiff, y + yDiff];

  const available = scan(x, y, direction);
  if (available == null) {
    return false;
  }
  
  const next = entities.get(`${nextX}_${nextY}`);
  if (next) {
    entities.set(`${available.x}_${available.y}`, next);
    entities.delete(`${nextX}_${nextY}`);
  }
  
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
    for (let x = 0; x < room[0].length; x++) {
      if (entities.get(`${x}_${y}`)?.type === 'wall') {
        row += '#'
      } else if (entities.get(`${x}_${y}`)?.type === 'box') {
        row += '0'
      } else if (robot.x === x && robot.y === y) {
        row += '@'
      } else {
        row += '.'
      }
    }
    console.log(row);
  }
}

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
  if (entity.type === 'box') {
    const [x, y] = pos.split('_').map(Number);
    sum += (100 * y) + x;
  }
});

console.log(sum);