import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const obstacles = new Set<string>();
let initPos = { x: 0, y: 0 };
let pos = { x: 0, y: 0 }
const bounds = { top: 0, right: data[0].length, bottom: data.length, left: 0 };
for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
        if (data[y][x] === '^') {
            pos = { x, y };
            initPos = { x, y };
        }

        if (data[y][x] === '#') {
            obstacles.add(`${x}_${y}`);
        }
    }
}
enum Direction {
    UP, RIGHT, DOWN, LEFT
}
let direction = Direction.UP;

const move = {
    [Direction.UP]: () => ({ ...pos, y: pos.y - 1 }),
    [Direction.RIGHT]: () => ({ ...pos, x: pos.x + 1 }),
    [Direction.DOWN]: () => ({ ...pos, y: pos.y + 1 }),
    [Direction.LEFT]: () => ({ ...pos, x: pos.x - 1 }),
}

const turn = {
    [Direction.UP]: () => direction = Direction.RIGHT,
    [Direction.RIGHT]: () => direction = Direction.DOWN,
    [Direction.DOWN]: () => direction = Direction.LEFT,
    [Direction.LEFT]: () => direction = Direction.UP,
}

const MAX_STEPS = 10000;

// is a loop if true
const checkPath = (updatedObstacles: Set<string>, extra = false) => {
    pos = initPos;
    const visited = new Set();
    let step = 0;
    direction = Direction.UP;
    while (true) {
        if (step > MAX_STEPS) {
            return true; // maybe true
        }

        const nextPos = move[direction]();
        if (visited.has(`${nextPos.x}_${nextPos.y}_${direction}`)) {
            return true;
        }

        if (updatedObstacles.has(`${nextPos.x}_${nextPos.y}`)) {
            turn[direction]();
            continue;
        }

        if (nextPos.x > bounds.right || nextPos.x < bounds.left || nextPos.y > bounds.bottom || nextPos.y < bounds.top) {
            if (extra) {
                return visited;
            }
            return false;
        }

        visited.add(`${nextPos.x}_${nextPos.y}_${direction}`);
        pos = nextPos;
        step++;
    }
}

const originalPath = checkPath(obstacles, true) as Set<string>;
const loopPos = new Set<string>();

let loopsFound = 0;
originalPath.forEach(key => {
    const [x, y, dir] = key.split('_');
    if (+x === initPos.x && +y === initPos.y) {
        return;
    }

    if (loopPos.has(`${x}_${y}`)) {
        return;
    }

    const updatedObstacles = new Set(obstacles);
    updatedObstacles.add(`${x}_${y}`);
    if (checkPath(updatedObstacles)) {
        loopPos.add(`${x}_${y}`);
    }
});

console.log(loopPos.size);
