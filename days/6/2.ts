import '../../types/helper.d.ts';

const inputFile = process.argv[2];
const rawData = await Bun.file(`${import.meta.dir}/${inputFile || 'input.txt'}`).text();
const data = rawData.split('\n');

const obstacles = new Set();
let pos = { x: 0, y: 0 }
const bounds = { top: 0, right: data[0].length, bottom: data.length, left: 0 };
for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
        if (data[y][x] === '^') {
            pos = { x, y };
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

const visited = new Set();
while (true) {
    const nextPos = move[direction]();
    if (obstacles.has(`${nextPos.x}_${nextPos.y}`)) {
        turn[direction]();
        continue;
    }

    if (nextPos.x > bounds.right || nextPos.x < bounds.left || nextPos.y > bounds.bottom || nextPos.y < bounds.top) {
        break;
    }

    visited.add(`${nextPos.x}_${nextPos.y}`);
    pos = nextPos;
}

console.log(visited.size);
